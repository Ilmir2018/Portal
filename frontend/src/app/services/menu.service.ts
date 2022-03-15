import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsGuard } from '../classes/permissions.guard';
import { sendItems } from '../components/menu/menu-update/menu-update.component';
import { TemplatePageComponent } from '../components/template-page/template-page.component';
import { NavItemNew, UserRole } from '../interfaces';
import { ContactsService } from './contacts.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public menuItems = [];
  public menuItemsOld = [];
  private routes = [];
  public settingsMenu: boolean = false
  public settingsItem: NavItemNew
  public readPerm: boolean = false
  public writePerm: boolean = false
  contacts: Array<UserRole> = []
  permissionForm: FormGroup;
  form: FormGroup;

  permissions: Array<any> = [
    { name: 'Нет прав', value: 'none' },
    { name: 'Читатель', value: 'read' },
    { name: 'Редактор', value: 'write' },
  ]

  addPermissions: Array<any> = [
    { name: 'Читатель', value: 'read' },
    { name: 'Редактор', value: 'write' },
  ]


  constructor(private router: Router, private http: HttpClient, private service: ContactsService, private fb: FormBuilder) {
    this.form = fb.group({
      read: false,
      write: false,
      delete: false,
    });
    this.permissionForm = new FormGroup({})
  }

  /**
   * Метод вызываемый при открытии окна редактирования пункта меню
   * в котором мы получаем список контактов для управления доступом к странице
   * @param menuItem пункт меню который мы открываем
   */
  getContacts(menuItem) {
    this.getPermissions(menuItem.id).subscribe((items) => {
      items.forEach((item: any) => {
        this.contacts.push({ name: item.name, email: item.email, user_id: item.user_id, permissions: [item.permissions[0], item.permissions[1], item.permissions[2]] })
        if (item.permissions[0] == true) {
          this.permissionForm.addControl(item.email, new FormControl('none'))
        } if (item.permissions[1] == true) {
          this.permissionForm.addControl(item.email, new FormControl('read'))
        } if (item.permissions[2] == true) {
          this.permissionForm.addControl(item.email, new FormControl('write'))
        }
      })
      localStorage.setItem('permission', JSON.stringify(this.permissionForm.value))
    })
  }

  getMenu() {
    let map = new Map(), menu: any, resultArr = []
    this.get().subscribe((data) => {
      menu = data
      //Отбираем пункты меню по user_id
      menu.forEach((items) => {
        // if(items.user_id == localStorage.getItem('id-user') || items.user_id == null) {
        resultArr.push(items)
        // }
      })
      //Первые уровни меню
      resultArr.forEach((item) => {
        //заполняем массив для добавления и удаления элементов на фронте
        this.menuItemsOld.push(item)
        //создаём объект для заполнения всех массивов и подмассивов
        let navItem: NavItemNew = {
          id: item.id, title: item.title, url: item.url,
          subtitle: [], parent_id: item.parent_id, level: item.level
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

      // console.log(this.menuItemsOld)
      //Убираем из добавления первые 4 изначальных пункта меню
      let filteredArray = this.menuItemsOld.filter(myFilter);

      // console.log(filteredArray)
      //Подгрузка всех роутов
      //если ставить resetConfig то при переходе по роутам, обновляется страница site-layout, что
      //приводит к закрыванию раскрытых пунктов меню
      // this.router.resetConfig(this.router.config)
      this.router.config.forEach((item, idx) => {
        filteredArray.forEach((route) => {
          if (item.canActivate) {
            item.children.push({ path: route.url, component: TemplatePageComponent, canActivate: [PermissionsGuard] })
          }
        })
      })
    })

    function myFilter(value, index) {
      if (value.url != 'settings' && value.url != 'profile' && value.url != 'contacts' && value.url != 'menu') {
        return index;
      }
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

  delete(menuItem: NavItemNew, arrayItems: NavItemNew[]): Observable<NavItemNew> {
    return this.http.delete<NavItemNew>(`/api/menu/${menuItem.id}?arrayItems=${arrayItems}`)
  }


  /**
   * @param title_id id изменяемого пункта меню
   * @param contacts Массив контактов права которых меняются
   */
  modalAdd(title_id: string, contacts: UserRole[]) {
    return this.http.post('/api/menu/modal', [title_id, contacts])
  }

  /**
   * тестовый гет запрос
   */
  getPermissions(id: string) {
    return this.http.get<Array<any>>(`/api/menu/modal/?itemId=${id}`)
  }

  /**
   * Функция для изменения расположения пунктов меню
   * @param elements в зависимости от значения change получем массив меняемых 
   * элементов с разной структурой - NavItemNew или sendItems
   * @param parent_id - передаётся id родителя для меняющегося пункта меню
   * @param change если true мможет измениться как уровень расположения
   *  пункта - level так и родитель пункта - parent_id
   */
  changeMenuStructure(elements: NavItemNew[] | sendItems[], parent_id: string, change: boolean) {
    return this.http.post('/api/menu/changeStructure', [elements, parent_id, change])
  }
}
