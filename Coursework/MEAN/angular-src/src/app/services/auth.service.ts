import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { RegisterParams } from '../registerparams';
import { Loginparams } from '../loginparams';
import { Observable } from 'rxjs';
import { Loggedinuser } from '../loggedinuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: String = "http://localhost:5000";
  http: HttpClient = inject(HttpClient);
  authToken: string | null = null;
  user: Loggedinuser | null = null;

  constructor() { }

  registerUser(user: RegisterParams): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}/users/register`, user, {
      headers: headers 
    });
  }

  authenticateUser(user: Loginparams): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}/users/authenticate`, user, {
      headers: headers 
    });
  }

  storeUserData(token: string, user: Loggedinuser) {
    // angular-jwt looks for the id_token key automatically from the local storage.
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
}
