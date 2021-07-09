import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact, GridColumnDefinition } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  changedColumns: GridColumnDefinition[] = []
  width1: number
  width2: number
  width3: number
  width4: number

  constructor(private http: HttpClient) {
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('/api/contacts')
  }

  create(data: Contact): Observable<Contact> {
    return this.http.post<Contact>('/api/contacts', data)
  }

}
