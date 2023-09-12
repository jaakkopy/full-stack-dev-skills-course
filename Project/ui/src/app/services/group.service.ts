import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  http: HttpClient = inject(HttpClient);
  baseUrl = environment.baseUrl;
  
  constructor() {}

  getUserGroupData(): null | Observable<any> {
    const token = localStorage.getItem('id_token');
    if (token == null) {
      return null;
    }
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'Authorization': token
    });
    return this.http.get(`${this.baseUrl}groups/usergroups`, {headers: headers});
  }
}
