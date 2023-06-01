import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import {Message } from '../model/message';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { MessageService } from '../service/message.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  public formGroup: FormGroup;

  public user : User;
  public refreshing: boolean;
  public listusers : User[];
  public messages : Message[] = [];
  private subscriptions: Subscription[] = [];
  public test: boolean;
  public personnes : Array<User>;
  public personnes2 : Array<User>;
  public isOnPage : boolean;
  public selectedUser : User;
  public filteredMessages : Message[];
  public selectedIndex : number = 0;
  public item : User;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  dropdownSettings = {};



  constructor(private router: Router,private authenticationService: AuthenticationService,
    private messageService: MessageService, private notificationService: NotificationService, private userService : UserService) {

      
     }

  ngOnInit(): void {
    window.scrollTo(0, 0)

    this.scrollToBottom();

    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
    
    this.getMessages(true);
    this.isOnPage = true;
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'userId',      
      textField: 'username',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      "closeDropDownOnSelection": true

      
    };
    this.subscriptions.push(

    interval(1000).subscribe(val => {
      if (!this.refreshing) {
        let tab = this.messages.filter(x=>x.expediteur===this.personnes[0] && x.readen===false);
        if (tab.length>0){this.getMessages(true);}
        else {this.getMessages(false);}
         
      }
   }))



  }

  public get isLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    return false;
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    var div = document.getElementById("scrollMe");
    div.scrollTop = div.scrollHeight;

              
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

  public getMessages(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.messageService.getMessagesByUser(this.user.username).subscribe(
        (response : Message[]) => {
          if (this.messages.length !== response.length){
          this.messages = response;
        }
        if (showNotification){          
          this.sortList();          
        }
          if (this.personnes.length>0 && showNotification){
            this.selectUser(this.personnes[0]);
          }
          this.refreshing = false;

          
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  public getUsers(showNotification : boolean){
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.listusers = response;
          this.listusers = this.listusers.filter(x=>x.username!==this.user.username)
          this.refreshing = false;
          
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );  }

  sortList(){
    var salut = new Array();
    var noms = new Array();
    this.messages.forEach(element => {
      
      if(element.expediteur.username===this.user.username){
        element.envoye = true;
      }
      else{
        element.envoye=false;
      }      
    });

    this.messages.forEach(x=>{
      if(x.envoye && noms.indexOf(x.destinataire.username)===-1){
        salut.push(x.destinataire);
        noms.push(x.destinataire.username);

      }
      else if(!x.envoye && noms.indexOf(x.expediteur.username)===-1){
        salut.push(x.expediteur);
        noms.push(x.expediteur.username);
      }
    })
    this.personnes = salut;
    this.personnes2 = salut;

  }


  selectUser(user : User){
    this.selectedUser = user;
    this.filteredMessages = this.messages.filter(x=>(x.destinataire.username===user.username||x.expediteur.username===user.username)).reverse();
    console.log(this.filteredMessages);
    this.messages.forEach(element => {
      if (element.expediteur.username===user.username){
          this.messageService.readMessage(element.id).subscribe(
            (Response : Message)=>{
            }
    );        
      }      
    });
    
  }

  setIndex(index : number){
    this.selectedIndex = index;
  }

  onSendMessage(messageForm : NgForm){
    const formData = this.messageService.createMessageFormData(this.user.username,this.selectedUser.username, messageForm.value);
    this.subscriptions.push(
      this.messageService.addMessage(formData).subscribe(
        (response: Message) => {
          messageForm.reset();
          this.getMessages(true);
          this.sendNotification(NotificationType.SUCCESS, `Message envoyé avec succès`);
          this.selectedIndex = 0;

        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
      );
      this.scrollToBottom();


  }

  onItemSelect(item: any) {
    this.item=item;
  }

  public newChat(form : NgForm){
    
    let tab = this.listusers.filter(x=>x.username===this.item.username);
    this.selectUser(tab[0]);
    this.selectedIndex = this.personnes.map(function(e) { return e.username; }).indexOf(tab[0].username);    
    form.reset;
    this.clickButton('nouveau-chat');
  }

  

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }


  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    for (const user of this.personnes2.filter(x=>x.username!==this.user.username)) {
      if (user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          results.push(user);
      }
    }
    this.personnes = results;
    
  }

  public newMessages():number{
    let messagesnotreaden = this.messages.filter(x=>x.expediteur.username!==this.user.username);
    let msg = 0;
    messagesnotreaden.forEach(element => {
      if (element.readen===false){
        msg+=1;
      }      
    });
    return msg;
  }

  public hasNewMessages(user : User):boolean{
    let tabtri = this.messages.filter(x=>x.expediteur===user && x.readen!==true)
    if (tabtri.length>0){
      
      return true;
    }
    else {
      return false;
    }
  }

  

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.isOnPage = false;
  }

}
