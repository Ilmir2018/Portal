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
    // if(params.firm != undefined) {
    //   params.firm = params.firm
    // }
    // if(params.email != undefined) {
    //   params.email = params.email
    // }
    // if(params.phone != undefined) {
    //   params.phone = params.phone
    // }
    // if(params.name != undefined) {
    //   params.name = params.name
    // }
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
