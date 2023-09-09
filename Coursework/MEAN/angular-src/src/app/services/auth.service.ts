import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { RegisterParams } from '../registerparams';
import { Loginparams } from '../loginparams';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: String = "http://localhost:5000";
  http: HttpClient = inject(HttpClient);

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
}
