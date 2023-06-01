import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { Router } from '@angular/router';
import { Role } from '../enum/role.enum';
import { NotificationType } from '../enum/notification-type.enum';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FileUploadStatus } from '../model/file-upload.status';
import { HttpErrorResponse } from '@angular/common/http';
import { CoursService } from '../service/cours.service';
import { NgForm } from '@angular/forms';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Cours } from '../model/cours';
import { User } from '../model/user';
import { Commentaire } from '../model/commentaire';


@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit {

  public listcours: Cours[];
  public user: User;
  public refreshing: boolean;
  public selectedUser: Cours;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public editUser = new Cours();
  public fileStatus = new FileUploadStatus();
  public matieres : string[];
  public niveaux : string[];
  public selectedCours: Cours[];
  public filteredCours: Cours[];
  public stars: string[] = ["1", "2", "3", "4", "5"];
  public selectedValue: string;
  public noteMoyenne : number;
  filter = { CP:false, CE1:false, CE2:false,
            MATHS:false, FRANCAIS:false, ANGLAIS:false };

  dropdownSettings = {};
  dropdownSettings2 = {};


  constructor(private router: Router, private authenticationService: AuthenticationService,
  private coursService: CoursService, private notificationService: NotificationService) {

    }

  ngOnInit(): void {
    window.scrollTo(0, 0)

    this.user = this.authenticationService.getUserFromLocalCache();
    this.getCours(true);

  }

  public getCours(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.coursService.getCours().subscribe(
        (response: Cours[]) => {
          this.listcours = response;
          this.filterChange();

          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} cours chargé(s) correctement`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }


  public get isLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    return false;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.PROF;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  public onLogOut(){
    const formData = this.authenticationService.createLogoutFormData(this.user.username);

    this.authenticationService.logout(formData).subscribe(
      (Response : User) =>{

      }
    );
    this.authenticationService.logOut();
    this.router.navigateByUrl("/login");
    this.sendNotification(NotificationType.SUCCESS, `Vous avez été déconnecté correctement.`);
  }
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur est survenue. Veuillez réessayer.');
    }
  }



  filterChange() {

    if (this.filter.CP === false && this.filter.CE1 === false && this.filter.CE2 === false && this.filter.MATHS === false && this.filter.FRANCAIS === false && this.filter.ANGLAIS === false){
      this.filteredCours=this.listcours;
    }
    else{
      if(((this.filter.CP || this.filter.CE1 || this.filter.CE2) && (!this.filter.MATHS && !this.filter.FRANCAIS && !this.filter.ANGLAIS))||((this.filter.MATHS || this.filter.FRANCAIS || this.filter.ANGLAIS) && (!this.filter.CP && !this.filter.CE1 && !this.filter.CE2))){
        this.filteredCours = this.listcours.filter(x =>
          ((x.niveau === 'CP' && this.filter.CP)
          || (x.niveau === 'CE1' && this.filter.CE1)
          || (x.niveau === 'CE2' && this.filter.CE2))
          || ((x.matiere === 'MATHS' && this.filter.MATHS)
          || (x.matiere === 'FRANCAIS' && this.filter.FRANCAIS)
          || (x.matiere === 'ANGLAIS' && this.filter.ANGLAIS))
       );
      }

      else{
      this.filteredCours = this.listcours.filter(x =>
        ((x.niveau === 'CP' && this.filter.CP)
        || (x.niveau === 'CE1' && this.filter.CE1)
        || (x.niveau === 'CE2' && this.filter.CE2))
        && ((x.matiere === 'MATHS' && this.filter.MATHS)
        || (x.matiere === 'FRANCAIS' && this.filter.FRANCAIS)
        || (x.matiere === 'ANGLAIS' && this.filter.ANGLAIS))

        );
      }



    }
  }

  public onAddNewCours(coursForm: NgForm): void {
    const formData = this.coursService.createCoursFormData(this.user.username, coursForm.value, this.profileImage);
    this.subscriptions.push(
      this.coursService.addCours(formData).subscribe(
        (response: Cours) => {
          this.getCours(false);
          this.clickButton('new-cours-close');
          this.fileName = null;
          this.profileImage = null;
          coursForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `Cours ajouté avec succès`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, 'Une erreur est survenue. Veuillez réessayer.');
          this.profileImage = null;
        }
      )
      );
  }

  public onAddNewAvis(avisForm: NgForm): void {
    const formData = this.coursService.createAvisFormData(this.user.username, avisForm.value, this.selectedUser.id, this.selectedValue);
    this.subscriptions.push(
      this.coursService.addAvis(formData).subscribe(
        (response: Commentaire) => {
          this.getCours(false);
          this.clickButton('new-avis-close');
          this.fileName = null;
          this.profileImage = null;
          avisForm.reset();
          this.selectedValue="0";
          this.sendNotification(NotificationType.SUCCESS, `Cours ajouté avec succès`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, 'Une erreur est survenue. Veuillez réessayer.');
          this.profileImage = null;
        }
      )
      );
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  public saveNewCours(): void {
    this.clickButton('new-cours-save');
  }

  public saveNewAvis(): void {
    this.clickButton('new-avis-save');
  }

  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName =  fileName;
    this.profileImage = profileImage;
  }

  public onDeleteCours(idCours: string): void {
    this.subscriptions.push(
      this.coursService.deleteCours(idCours).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getCours(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public onSelectUser(selectedUser: Cours): void {
    this.selectedUser = selectedUser;
    this.clickButton('addAvis');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  countStar(star) {
    this.selectedValue = star;
  }

  public calHandle(i: number) {
    var sum = 0;
    var keys = this.listcours[i].commentaires;
    keys.forEach(key => {

        sum += Number(key.note);

    });
    this.listcours[i].notemoyenne = Math.round(sum / (keys.length) * 100) / 100;
    return this.listcours[i].notemoyenne;
  }



}
