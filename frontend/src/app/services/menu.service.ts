import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ContactsPageComponent } from '../components/contacts-page/contacts-page.component';
import { SettingsPageComponent } from '../components/settings-page/settings-page.component';
import { NavItem, NavItemNew } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menuItems = [];
  public postgresMenu: any
  private routes = [];

  constructor(private router: Router, private http: HttpClient) {
  }

  getMenu() {
    // this.service.getContacts().subscribe(contacts => {
    //   this.navItems = contacts.menu
    //   //формируем url роутов
    //   this.recursionRoutes(this.navItems);

    //   // Загружаем с бэка все роуты
    //   this.router.config.forEach((item) => {
    //     if (item.canActivate) {
    //       this.routes.forEach((route) => {
    //         if (route !== 'first') {
    //           item.children.push({ path: route, component: SettingsPageComponent })
    //         } else {
    //           item.children.push({ path: route, component: ContactsPageComponent })
    //         }

    //         // this.router.resetConfig(this.router.config);
    //         // this.router.navigate([route], {relativeTo: this.route});
    //       })
    //     }
    //   })
    // })

    let map = new Map()
    this.get().subscribe((data) => {
      this.postgresMenu = data
      //Первые уровни меню
      this.postgresMenu.forEach((item) => {
        let navItem: NavItemNew = {
          id: item.id, title: item.title, url: item.url,
          subtitle: [], level: item.parent_id
        }
        map.set(item.id, navItem)
        if(item.parent_id == null) {
          this.menuItems.push(navItem)
        }
      })
      //Два раза перебор для того чтобы при сортировке по id
      //в map сначала заполнились пункты первого уровня меню
      //а вторым циклом мы заполняем все вложенные subtitle
      this.postgresMenu.forEach((item) => {
        if(item.parent_id !== null) {
          let obj = map.get(item.parent_id)
          obj.subtitle.push(map.get(item.id))
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

  update(data: any) {
      return this.http.patch(`/api/menu/${data.id}`, data)
  }

  get() {
    return this.http.get<NavItemNew>('/api/menu')
  }
}
