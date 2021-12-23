import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact, ContactField, ContactResponse, GridColumnDefinition } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class ContactsService {

  // changeColumnsCount = []

  //Сделать подгрузку с базы данных столбцы из новой созданной таблицы
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

  getContactsFields(): Observable<any> {
    return this.http.get<any>('/api/contacts/edit')
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

  update(id: string, image?: File, data?: Array<any>): Observable<Contact> {
    const formData = new FormData()
    for (let cont in data) {
      formData.append(cont, data[cont])
    }
    if (image) {
      formData.append('image', image, image.name)
    }
    return this.http.patch<Contact>(`/api/contacts/${id}`, formData)
  }

  delete(id: string, user_id: string): Observable<Contact> {
    return this.http.delete<Contact>(`/api/contacts/${id}?user_id=${user_id}`)
  }


  /**
   * Функция либо обновления столбцов в таблице либо 
   * создания нового столбца взависимости от значения change
   * @param data массив 
   * @param change флаг
   * @returns 
   */
  updateFields(change: boolean, data?: ContactField[], value?: string) {
    return this.http.post(`/api/contacts/edit`, [change, data, value])
  }

  deleteFields(id: number, field: string) {
    return this.http.delete(`/api/contacts/edit/${id}?field=${field}`)
  }

  updateField(id: number, oldField: string, newField: string) {
    return this.http.patch<Contact>(`/api/contacts/edit/${id}`, [oldField, newField])
  }

}
