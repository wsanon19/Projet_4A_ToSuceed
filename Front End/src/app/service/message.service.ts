import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Message } from "../model/message";
import { User } from "../model/user";

@Injectable({providedIn: 'root'})
export class MessageService {
  private host = environment.apiUrl;
  public msgs : number;

  constructor(private http: HttpClient) {}

  public getMessagesByUser(username : string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.host}/message/list/${username}`);
  }

  public addMessage(formData: FormData): Observable<Message> {
    return this.http.post<Message>(`${this.host}/message/save`, formData);
  }

  public addMessagesToLocalCache(messages: Message[]): void {
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  public createMessageFormData(loggedInUsername: string, usernamedest:string, message : Message): FormData {
    const formData = new FormData();
    formData.append('usernameExp', loggedInUsername);
    formData.append('contenu_msg', message.contenu_msg);
    formData.append('usernameDest',usernamedest);    
    return formData;
  }

  public readMessage(idMessage : string ) : Observable<Message>{
    return this.http.post<Message>(`${this.host}/message/read`, idMessage);

  }


}
