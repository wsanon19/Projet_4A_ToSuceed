import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cours } from '../model/cours';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Messagedujour } from '../model/messagedujour';

@Injectable({providedIn: 'root'})
export class MessagedujourService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getMessagedujour(): Observable<Messagedujour[]> {
    return this.http.get<Messagedujour[]>(`${this.host}/messagedujour/list`);
  }

  public addMessagedujour(formData: FormData): Observable<Messagedujour> {
    return this.http.post<Messagedujour>(`${this.host}/messagedujour/save`, formData);
  }

  public addMessagedujourToLocalCache(messagedujour: Messagedujour[]): void {
    localStorage.setItem('messagesdujour', JSON.stringify(messagedujour));
  }

  public createMessageFormData(loggedInUsername: string, messagedujour : Messagedujour): FormData {
    const formData = new FormData();
    formData.append('username', loggedInUsername);
    formData.append('contenu_msg', messagedujour.contenu_msg);

    return formData;
  }





}
