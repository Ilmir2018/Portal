import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ContactsPageComponent } from '../components/contacts-page/contacts-page.component';
import { SettingsPageComponent } from '../components/settings-page/settings-page.component';
import { NavItem } from '../interfaces';
import { ContactsService } from './contacts.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  filter: string = '';
  public navItems: any;
  private routes = [];

  constructor(private service: ContactsService, private router: Router, private http: HttpClient) {
  }

  getMenu() {
    this.service.getContacts().subscribe(contacts => {
      this.navItems = contacts.menu
      //формируем url роутов
      this.recursionRoutes(this.navItems);

      // Загружаем с бэка все роуты
      this.router.config.forEach((item) => {
        if (item.canActivate) {
          this.routes.forEach((route) => {
            if (route !== 'first') {
              item.children.push({ path: route, component: SettingsPageComponent })
            } else {
              item.children.push({ path: route, component: ContactsPageComponent })
            }

            // this.router.resetConfig(this.router.config);
            // this.router.navigate([route], {relativeTo: this.route});
          })
        }
      })
    })
  }

  recursionRoutes(arr: any) {
    arr.forEach((item) => {
      this.routes.push(item.url)
      if(item.subtitle.length ! == 0) {
        this.recursionRoutes(item.subtitle)
      }
    })
  }

  update(id: string, data: any) {
      return this.http.patch(`/api/menu/${id}`, data)
  }
}
