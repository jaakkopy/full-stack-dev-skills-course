import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewShoppingListItem } from '../interfaces/new-shopping-list-item';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  http: HttpClient = inject(HttpClient);
  baseUrl = environment.baseUrl;

  constructor() { }

  getListsForGroup(groupId: String): null | Observable<any> {
    const token = localStorage.getItem('id_token');
    if (token == null) {
      return null;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get(`${this.baseUrl}lists/groups/${groupId}`, { headers: headers });
  }

  getListData(listId: String): null | Observable<any> {
    const token = localStorage.getItem('id_token');
    if (token == null) {
      return null;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get(`${this.baseUrl}lists/${listId}`, { headers: headers });
  }

  postNewItem(listId: String, newItem: NewShoppingListItem): null | Observable<any> {
    const token = localStorage.getItem('id_token');
    if (token == null) {
      return null;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.post(`${this.baseUrl}lists/${listId}`, newItem, { headers: headers });
  }

  deleteItem(listId: string, itemId: string): null | Observable<any> {
  const token = localStorage.getItem('id_token');
    if (token == null) {
      return null;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.delete(`${this.baseUrl}lists/${listId}/${itemId}`, { headers: headers });
  }

  updateListItem(listId: string, itemId: string, newValues: any): null | Observable<any> {
    const token = localStorage.getItem('id_token');
    if (token == null) {
      return null;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.put(`${this.baseUrl}lists/${listId}/${itemId}`, newValues, { headers: headers });
  }
}
