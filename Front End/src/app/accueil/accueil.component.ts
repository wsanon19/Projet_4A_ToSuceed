import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
import { MessageComponent } from '../message/message.component';
import { Message } from '../model/message';
import { Messagedujour } from '../model/messagedujour';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { MessageService } from '../service/message.service';
import { MessagedujourService } from '../service/messagedujour.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  public messages: Messagedujour[];
  public messagedujour : Messagedujour;
  public messagesalire : Message[];
  public refreshing: boolean;
  public user: User;
  public msgs : number;

  private subscriptions: Subscription[] = [];
  public newmessages: number;

  
  constructor(private router: Router, private authenticationService: AuthenticationService,
    private userService: UserService, private notificationService: NotificationService, private messagedujourService : MessagedujourService, private messageService : MessageService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0)

    this.user = this.authenticationService.getUserFromLocalCache();

    this.getMessagesdujour(false); 
    this.getMessages(true);
 
 
  }

  public getMessages(showNotification: boolean): void {
    let msg = 0;
    this.subscriptions.push(
      this.messageService.getMessagesByUser(this.user.username).subscribe(
        (response : any) => {
          this.messagesalire = response;
          let messagesnotreaden = this.messagesalire.filter(x=>x.expediteur.username!==this.user.username);   
            messagesnotreaden.forEach(element => {
              if (element.readen===false){
                msg+=1;
              }    
            })
            this.msgs = msg;
          this.refreshing = false;
          
          
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }


  public getMessagesdujour(showNotification: boolean): void {
    this.subscriptions.push(
      this.messagedujourService.getMessagedujour().subscribe(
        (response: Messagedujour[]) => {
          this.messages = response;
          this.messagedujour = this.messages[Math.floor(Math.random() * this.messages.length)];

          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
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
      this.notificationService.notify(notificationType, 'Une erreur est apparue. Veuillez réessayer.');
    }
  }

  public saveNewMessage(): void {
    this.clickButton('new-messagedujour-save');
  }

  public saveNewContact(): void {
    this.clickButton('new-contact-save');
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  public onAddNewMessage(messageForm: NgForm): void {
    const formData = this.messagedujourService.createMessageFormData(this.user.username, messageForm.value);
    this.subscriptions.push(
      this.messagedujourService.addMessagedujour(formData).subscribe(
        (response: Messagedujour) => {
          this.clickButton('new-messagedujour-close');
          this.getMessagesdujour(false);
          messageForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `Message ajouté avec succès`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
      );
  }

  public onContact(messageForm: NgForm): void {
    const formData = this.messageService.createMessageFormData(this.user.username,"MACI",messageForm.value);
    this.subscriptions.push(
      this.messageService.addMessage(formData).subscribe(
        (response: Message) => {
          this.clickButton('new-contact-close');
          this.getMessages(false);
          messageForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `Message envoyé avec succès`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
      );
  }

  

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
