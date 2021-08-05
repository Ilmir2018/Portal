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

  columns: GridColumnDefinition[] = [
    { field: 'name', width: 60, name: 'name', show: true, order: 1 },
    { field: 'firm', width: 10, name: 'firm', show: true, order: 2 },
    { field: 'email', width: 40, name: 'email', show: true, order: 3 },
    { field: 'phone', width: 55, name: 'phone', show: true, order: 4 },

  ];

  constructor(private http: HttpClient) {
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('/api/contacts')
  }

  getById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`/api/contacts/${id}`)
  }

  create(data: Contact): Observable<Contact> {
    return this.http.post<Contact>('/api/contacts', data)
  }

  update(id: string, name: string, firm: string,
     email: string, phone: string, roles: []): Observable<Contact> {

    let data = {name, firm, email, phone, roles};

    return this.http.patch<Contact>(`/api/contacts/${id}`, data)
  }

}
