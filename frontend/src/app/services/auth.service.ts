import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private token = null;

  constructor(private http: HttpClient) { }

  login(user: User): Observable<{ token: string, role: string, id: string, permissions: any }> {
    //Сохраняем в хранилище вводимый пароль для вывода его в профиле
    localStorage.setItem('password', user.password)
    return this.http.post<{ token: string, role: string, id: string, permissions: any }>('/api/auth/login', user)
      .pipe(
        tap(
          ({ token, role, id, permissions }) => {
            let item = role
            //Сохраняем в локальном хранилище токен, роль и id пользователя, а также массив объектов с доступами на страницы
            localStorage.setItem('auth-token', token)
            localStorage.setItem('role', item)
            localStorage.setItem('id-user', id)
            localStorage.setItem('permissions', JSON.stringify(permissions))
            this.setToken(token)
          }
        )
      )
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user)
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
    let storageItems = ['visibleColumns','id-user','widthScreen','password',
    'auth-token','permissions','role'];
    storageItems.forEach((item) => {
      this.removeStorage(item)
    })
  }

  private removeStorage(item: string) {
    localStorage.removeItem(item)
  }
}
