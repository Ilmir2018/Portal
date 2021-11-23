import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact, ContactResponse, GridColumnDefinition } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class ContactsService {

  columns: GridColumnDefinition[] = [
    { field: 'name', width: 10, name: 'name', show: true, order: 1 },
    { field: 'firm', width: 40, name: 'firm', show: true, order: 2 },
    { field: 'email', width: 20, name: 'email', show: true, order: 3 },
    { field: 'phone', width: 30, name: 'phone', show: true, order: 4 },
  ];

  constructor(private http: HttpClient) {
  }

  getContacts(): Observable<any> {
    return this.http.get<ContactResponse>('/api/contacts')
  }

  getById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`/api/contacts/${id}`)
  }

  create(data: Contact, image?: File): Observable<Contact> {
    const formData = new FormData();

    if (image) {
      formData.append('image', image, image.name)
    }
    formData.append('name', data.name)
    formData.append('firm', data.firm)
    formData.append('phone', data.phone)
    formData.append('email', data.email)
    formData.append('password', data.password)
    return this.http.post<Contact>('/api/contacts', formData)
  }

  update(id: string, name: string, firm: string,
    email: string, phone: string, roles: [], image: File, password?: string): Observable<Contact> {
    const formData = new FormData()

    if (image) {
      formData.append('image', image, image.name)
    }
    formData.append('id', id)
    formData.append('name', name)
    formData.append('firm', firm)
    formData.append('phone', phone)
    formData.append('email', email)

    if (password) {
      formData.append('password', password)
    }
    
    return this.http.patch<Contact>(`/api/contacts/${id}`, formData)
  }

  delete(id: string, user_id: string): Observable<Contact> {
    return this.http.delete<Contact>(`/api/contacts/${id}?user_id=${user_id}`)
  }

}
