import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewShoppingListItem } from '../interfaces/new-shopping-list-item';
import { makeHeadersWithAuthField } from './helpers';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  http: HttpClient = inject(HttpClient);
  baseUrl = environment.baseUrl;

  constructor() { }

  getListsForGroup(groupId: String): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.get(`${this.baseUrl}lists/groups/${groupId}`, { headers: headers });
  }

  getListData(listId: String): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.get(`${this.baseUrl}lists/${listId}`, { headers: headers });
  }

  createList(groupId: string, name: string, date: string): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.post(`${this.baseUrl}lists`, {group: groupId, name, date}, { headers: headers });
  }

  deleteList(listId: string): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.delete(`${this.baseUrl}lists/${listId}`, { headers: headers });
  }

  postNewListItem(listId: String, newItem: NewShoppingListItem): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.post(`${this.baseUrl}lists/${listId}`, newItem, { headers: headers });
  }

  deleteListItem(listId: string, itemId: string): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.delete(`${this.baseUrl}lists/${listId}/${itemId}`, { headers: headers });
  }

  updateListItem(listId: string, itemId: string, newValues: any): null | Observable<any> {
    const headers = makeHeadersWithAuthField();
    return headers == null ? null : this.http.put(`${this.baseUrl}lists/${listId}/${itemId}`, newValues, { headers: headers });
  }
}
