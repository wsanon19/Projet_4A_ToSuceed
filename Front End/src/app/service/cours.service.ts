import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cours } from '../model/cours';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Commentaire } from '../model/commentaire';

@Injectable({providedIn: 'root'})
export class CoursService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getCours(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.host}/cours/list`);
  }

  public addCours(formData: FormData): Observable<Cours> {
    return this.http.post<Cours>(`${this.host}/cours/save`, formData);
  }

  public addAvis(formData: FormData): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.host}/commentaire/save`, formData);
  }

  public deleteCours(username: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/cours/delete/${username}`);
  }

  public addCoursToLocalCache(cours: Cours[]): void {
    localStorage.setItem('cours', JSON.stringify(cours));
  }

  createCoursFormData(loggedInUsername : string, cours : Cours, profileImage: File) {
    const formData = new FormData();
    formData.append('currentusername', loggedInUsername);
    formData.append('nom', cours.nom);
    formData.append('niveau', cours.niveau);
    formData.append('description', cours.description);
    formData.append('matiere', cours.matiere);
    formData.append('profileImage', profileImage);


    return formData;
  }

  createAvisFormData(loggedInUsername : string, commentaire : Commentaire, idCours : string, note : string) {
    const formData = new FormData();
    formData.append('username', loggedInUsername);
    formData.append('contenu', commentaire.contenu_com);
    formData.append('id_cours', idCours);
    formData.append('note', note);



    return formData;
  }




}
