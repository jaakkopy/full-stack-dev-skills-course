import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { environment } from 'src/environments/environment';
import { Loggedinuser } from '../interfaces/loggedinuser';
import { Registerparams } from '../interfaces/registerparams';
import { Loginparams } from '../interfaces/loginparams';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;
  http: HttpClient = inject(HttpClient);
  authToken: string | null = null;
  user: Loggedinuser | null = null;

  constructor() { }

  registerUser(user: Registerparams): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}users/register`, user, {
      headers: headers
    });
  }

  authenticateUser(user: Loginparams): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}users/authenticate`, user, {
      headers: headers
    });
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  isLoggedIn() {
    const service = new JwtHelperService();
    return !service.isTokenExpired(this.authToken);
  }

  storeUserData(token: string, user: Loggedinuser) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}