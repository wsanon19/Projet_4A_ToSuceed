import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from '../enum/header-type.enum';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.component.css']
})
export class AbonnementComponent implements OnInit {
  private user : User;
  private subscriptions: Subscription[] = [];


  constructor(private router: Router, private authenticationService: AuthenticationService, private userservice : UserService, private notificationService : NotificationService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0)

    this.user = this.authenticationService.getUserFromLocalCache();

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

  Suscribe(mois : number){
    const formData = this.userservice.createAbonnementFormData(this.user.username, mois);
    this.subscriptions.push(
      this.userservice.suscribe(formData).subscribe(
        (response: User) => {
          
          this.sendNotification(NotificationType.SUCCESS, `Vous êtes désormais abonné !`);
          this.router.navigateByUrl("/accueil");
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
      );
      
    this.subscriptions.push(
      this.userservice.getUser(this.user.username).subscribe(
        (response: HttpResponse<User>) => {
          console.log(response);
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body);
          this.router.navigateByUrl('/accueil');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
      

  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur est apparue. Veuillez réessayer.');
    }
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

    public get isSuscribed():boolean{
      if (this.user.abonnement !== null){
        return true;
      }
      return false;
    }

}
