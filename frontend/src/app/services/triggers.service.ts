import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trigger, triggerPageAnswer } from '../components/triggers-page/triggers-page.component';

@Injectable({
  providedIn: 'root'
})
export class TriggersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<triggerPageAnswer> {
    return this.http.get<triggerPageAnswer>('/api/triggers')
  }

  createNew(data: Trigger): Observable<Trigger> {
    return this.http.post<Trigger>('/api/triggers', data)
  }
}
