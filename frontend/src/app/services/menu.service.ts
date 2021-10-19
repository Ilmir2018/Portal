import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TemplatePageComponent } from '../components/template-page/template-page.component';
import { NavItemNew } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menuItems = [];
  public menuItemsOld = [];
  private routes = [];

  constructor(private router: Router, private http: HttpClient) {
  }

  getMenu() {
    let map = new Map(), menu: any, resultArr = []
    this.get().subscribe((data) => {
      menu = data

      //Отбираем пункты меню по user_id
      menu.forEach((items) => {
        if(items.user_id == localStorage.getItem('id-user') || items.user_id == null) {
          resultArr.push(items)
        }
      })

      //Первые уровни меню
      resultArr.forEach((item) => {
        //заполняем массив для добавления и удаления элементов на фронте
        this.menuItemsOld.push(item)
        //создаём объект для заполнения всех массивов и подмассивов
        let navItem: NavItemNew = {
          id: item.id, title: item.title, url: item.url,
          subtitle: [], parent_id: item.parent_id
        }
        map.set(item.id, navItem)
        if (item.parent_id == null) {
          this.menuItems.push(navItem)
        }
      })
      //Два раза перебор для того чтобы при сортировке по id
      //в map сначала заполнились пункты первого уровня меню
      //а вторым циклом мы заполняем все вложенные subtitle
      resultArr.forEach((item) => {
        if (item.parent_id !== null) {
          let obj = map.get(item.parent_id)
          obj.subtitle.push(map.get(item.id))
        }
      })
    })

    //Подгрузка всех роутов
    setTimeout(() => {
      //Убираем из добавления первые 4 изначальных пункта меню
      let filteredArray = this.menuItemsOld.filter(myFilter);

      this.router.config.forEach((item) => {
        filteredArray.forEach((route) => {
          if (item.canActivate) {
            item.children.push({ path: route.url, component: TemplatePageComponent })
          }
        })
      })
    }, 1000)

    function myFilter(value, index) {
      return index > 3;
    }
    
  }

  recursionRoutes(arr: any) {
    arr.forEach((item) => {
      this.routes.push(item.url)
      if (item.subtitle.length! == 0) {
        this.recursionRoutes(item.subtitle)
      }
    })
  }

  /**
   * Функция переводит русский язык в латницу, формирует url
   * @param word входящее название title, которое можно менять
   * @returns url
   */
  translit(word) {
    var answer = '';
    var converter = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
      'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
      'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
      'э': 'e', 'ю': 'yu', 'я': 'ya',

      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
      'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
      'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
      'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
      'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch',
      'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '',
      'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };

    for (var i = 0; i < word.length; ++i) {
      if (converter[word[i]] == undefined) {
        answer += word[i];
      } else {
        answer += converter[word[i]];
      }
    }

    return answer.toLowerCase();
  }

  /**
   * загрузка пунктов меню с сервера
   */

  get() {
    return this.http.get<NavItemNew>(`/api/menu`)
  }

  /**
   * Обновление пункта меню на сервере
   * @param data обновляемый объект
   */

  update(data: any) {
    return this.http.patch(`/api/menu/${data.id}`, data)
  }

  /**
   * Добавление нового пункта меню на сервер
   * @param data новый пунтт меню
   */

  add(data: NavItemNew): Observable<NavItemNew> {
    return this.http.post<NavItemNew>('/api/menu', data)
  }

  /**
   * Удаление пунта меню
   * @param menuItem удаляемый элемент
   */

  delete(menuItem: NavItemNew): Observable<NavItemNew> {
    return this.http.delete<NavItemNew>(`/api/menu/${menuItem.id}`)
  }
}
