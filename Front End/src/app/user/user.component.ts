import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { FormControl, NgForm } from '@angular/forms';
import { CustomHttpRespone } from '../model/custom-http-response';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { FileUploadStatus } from '../model/file-upload.status';
import { Role } from '../enum/role.enum';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[];
  public user: User;
  public refreshing: boolean;
  public selectedUser: User;
  public fileName: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];
  public editUser = new User();
  private currentUsername: string;
  public fileStatus = new FileUploadStatus();
  public selectedUsers: User[];
  public filteredUsers: User[];
  filter = { CP: true, CE1: true, CE2: true};

  dropdownSettings = {};



  constructor(private router: Router, private authenticationService: AuthenticationService,
              private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0)

    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);

    
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'userId',      
      textField: 'role',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll	: true
    };

  }
  onItemSelect(item: any) {
    /* console.log('reactive form value ', this.selectedUsers);
    console.log('Actual data ', this.getObjectListFromData(this.selectedUsers.map(item => item.userId))); */
    this.filteredUsers = this.getObjectListFromData(this.selectedUsers.map(item => item.userId));
  }

  onItemDeselect(item: any) {
    /* console.log('reactive form value ', this.selectedUsers);
    console.log('Actual data ', this.getObjectListFromData(this.selectedUsers.map(item => item.userId))); */
    this.filteredUsers = this.getObjectListFromData(this.selectedUsers.map(item => item.userId));
  }

  onDeselectAll(){
    this.filteredUsers = [];
  }

  
  getObjectListFromData(ids){
    return this.users.filter(item => ids.includes(item.userId))
  }

  onSelectAll(items: any) {
     
    //console.log(items);
    this.filteredUsers = this.users;

  }


  public get isLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    return false;
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.users = response;
          this.filteredUsers=response;

          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} utilisateurs chargés correctement.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }
  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName =  fileName;
    this.profileImage = profileImage;
  }

  

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormData(this.user, userForm.value, this.profileImage);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = null;
          this.profileImage = null;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} ajouté avec succès`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
      );
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserUpdateFormData(this.currentUsername, this.editUser, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} modifié avec succès`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
      );
  }

  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    const formData = this.userService.createUserFormData(this.user, user, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          this.getUsers(false);
          this.fileName = null;
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} modifié avec succès`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
          this.profileImage = null;
        }
      )
      );
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      )
    );
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}\ : la photo de profil a été modifiée avec succès`);
          this.fileStatus.status = 'done';
          break;
        } else {
          this.sendNotification(NotificationType.ERROR, `Impossible d'importer l'image. Veuillez réessayer.`);
          break;
        }
      default:
        `Finished all processes`;
    }
  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
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

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress, this.user.username).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, error.error.message);
          this.refreshing = false;
        },
        () => emailForm.reset()
      )
    );
  }

  public onDeleteUser(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.clickButton('openUserEdit');
  }

  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    for (const user of this.users) {
      if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          results.push(user);
      }
    }
    this.filteredUsers = results;
    
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

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur est apparue. Veuillez réessayer.');
    }
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  filterChange() {
    this.filteredUsers = this.users.filter(x => 
       ((x.role === 'ROLE_ELEVE' && this.filter.CP)
       || (x.role === 'ROLE_MANAGER' && this.filter.CE1)
       || (x.role === 'ROLE_SUPER_ADMIN' && this.filter.CE2))
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
