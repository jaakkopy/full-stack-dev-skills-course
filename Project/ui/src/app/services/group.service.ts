import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { makeHeadersWithAuthField } from './helpers';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  http: HttpClient = inject(HttpClient);
  baseUrl = environment.baseUrl;
  
  constructor() {}

  createGroup(name: string, password: string): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.post(`${this.baseUrl}groups`, {name, password}, {headers: headers});
  }

  getUserGroupData(): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.get(`${this.baseUrl}groups`, {headers: headers});
  }

  deleteGroup(groupId: string): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.delete(`${this.baseUrl}groups/${groupId}`, {headers: headers});
  }

  joinGroup(name: string, password: string): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.post(`${this.baseUrl}groups/join`, {name, password}, {headers: headers});
  }

  getGroupById(groupId: string): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.get(`${this.baseUrl}groups/${groupId}`, {headers: headers});
  }

  getGroupByNamePattern(pattern: string, batchNum: number): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.get(`${this.baseUrl}groups/name/${pattern}/${batchNum}`, {headers: headers});
  }

  leaveGroup(groupId: string): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.delete(`${this.baseUrl}users/group/${groupId}`, {headers: headers});
  }
}
