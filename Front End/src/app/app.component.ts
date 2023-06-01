import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { NotificationType } from './enum/notification-type.enum';
import { User } from './model/user';
import { AuthenticationService } from './service/authentication.service';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private user : User;
  constructor(private notificationService : NotificationService, private bnIdle: BnNgIdleService, private authenticationService: AuthenticationService, private router : Router) { // initiate it in your component constructor
    this.bnIdle.startWatching(300).subscribe((res) => {
      if(res) {
        if (this.authenticationService.isUserLoggedIn()){
          console.log("session expired");
          this.user = this.authenticationService.getUserFromLocalCache();
          const formData = this.authenticationService.createLogoutFormData(this.user.username);

          this.authenticationService.logout(formData).subscribe(
            (Response : User) =>{
              
            }
          );
          this.authenticationService.logOut();
          this.router.navigateByUrl("/login");
          this.sendNotification(NotificationType.SUCCESS, `Vous avez été déconnecté pour cause d'inactivité.`);
    
        }
          
      }
    })
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur est apparue. Veuillez réessayer.');
    }
  }
}
