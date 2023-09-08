import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Registereduser } from '../registereduser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: String = "http://localhost:5000";
  http: HttpClient = inject(HttpClient);

  constructor() { }

  registerUser(user: Registereduser) {
    let headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}/users/register`, user, {
      headers: headers 
    });
  }
}
