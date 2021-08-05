import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface role {
  item: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null;

  constructor(private http: HttpClient) { }

  login(user: User):Observable<{token: string, role: role}> {
    return this.http.post<{token: string, role: role}>('/api/auth/login', user)
    .pipe(
      tap(
        ({token, role}) => {
          let item = role[0]
          //Сохраняем в локальном хранилище токен и роль пользователя
          localStorage.setItem('auth-token', token)
          localStorage.setItem('role', item)
          this.setToken(token)
        }
      )
    )
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register' ,user)
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string {
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    this.setToken(null)
    localStorage.clear()
  }
}
