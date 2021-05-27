import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) { }

  getContacts(params: any = {}): Observable<Contact[]> {
    return this.http.get<Contact[]>('/api/contacts', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  create(data: Contact): Observable<Contact> {
    return this.http.post<Contact>('/api/contacts', data)
  }

}
