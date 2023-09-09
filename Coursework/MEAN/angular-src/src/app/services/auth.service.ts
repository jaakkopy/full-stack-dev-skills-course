import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { RegisterParams } from '../registerparams';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: String = "http://localhost:5000";
  http: HttpClient = inject(HttpClient);

  constructor() { }

  registerUser(user: RegisterParams) {
    let headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}/users/register`, user, {
      headers: headers 
    });
  }
}
