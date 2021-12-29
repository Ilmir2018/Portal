import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';
import { Contact, NavItemNew, UserRole } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';
import { MenuService } from 'src/app/services/menu.service';
import { TemplatePageComponent } from '../../template-page/template-page.component';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent implements OnInit {

  public newItem = false
  public inputValue: string
  data: NavItemNew
  public forbiddenItems = []
  form: FormGroup;
  contacts: Array<UserRole> = []
  @Input() public settingsItem: NavItemNew;
  role: string
  arr = []

  Data: Array<any> = [
    { name: 'read' },
    { name: 'write' },
    { name: 'delete' },
  ]

  toppings = new FormControl();

  constructor(public service: MenuService, private router: Router,
    private fb: FormBuilder, public contactService: ContactsService) {
    this.form = fb.group({
      read: false,
      write: false,
      delete: false,
    });
    this.role = localStorage.getItem('role')
  }

  ngOnInit(): void {
    this.forbiddenItems = ['contacts', 'menu', 'profile', 'settings']

    //Сохраняем в переменную все контакты, для оперделения прав доступа
    this.contactService.getContacts().subscribe((items) => {
      items.contacts.forEach((item: Contact) => {
        this.contacts.push({ email: item.email, user_id: item.user_id, permissions: [this.form.value.read, this.form.value.write, this.form.value.delete] })
      })
    })
  }

  /**
   * Функция для изменения прав пользователей
   */
  changePermissions() {
    //Доабвляем в каждый объект контакта id страницы, которую редактируем
    this.contacts.forEach((item) => {
      item.permissions = [this.form.value.read, this.form.value.write, this.form.value.delete]
    })
    this.service.modalAdd(this.service.settingsItem.id, this.toppings.value).subscribe(
      modal => {
        MaterialService.toast('Изменения сохранены')
      }, error => {
        MaterialService.toast(error.error.message)
      }
    )

  }

  /**
   * Функция обновления объекта в базе
   * @param item Обновляемый объект
   */
  save(item) {
    item.title = this.inputValue
    item.url = this.service.translit(this.inputValue)
    this.service.update(item).subscribe(
      menu => {
        MaterialService.toast('Изменения сохранены')
      }, error => {
        MaterialService.toast(error.error.message)
      }
    )
  }

  /**
   * Функция добавления дочерних пунктов меню
   * @param item добавляемый пункт меню
   */
  add(item: NavItemNew) {
    let object = { title: this.inputValue, url: this.service.translit(this.inputValue), parent_id: item.id }
    let url = this.service.translit(this.inputValue);
    //Добавляем новый пункт меню
    this.service.add(object).subscribe(
      newItem => {
        //Формируем на фронте с помощью функции addNewItem обновлённый массив меню
        this.service.menuItemsOld.push(newItem)
        this.updateMenuItems()
        MaterialService.toast('Элемент добавлен')
        this.newItem = false;
        //Добавляем новый адрес в массив роутов
        this.router.config.forEach((item) => {
          if (item.canActivate) {
            item.children.push({ path: url, component: TemplatePageComponent })
          }
        })
      },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
    this.newItem = false;
  }

  remove(item: NavItemNew) {
    const decision = window.confirm(`Вы уверены что хотите удалить этот пункт меню?`)
    if (decision) {
      //Удаление элемена на фронте
      this.recursionFunc(item)
      this.arr.push(item)
      this.arr.forEach((removeItem) => {
        const idx = this.service.menuItemsOld.findIndex(p => p.id === removeItem.id)
        this.service.menuItemsOld.splice(idx, 1)
      })
      this.updateMenuItems()
      //Образуем массив id которые удаляем
      let idItems = []
      this.arr.forEach((itemSend) => {
        idItems.push(itemSend.id)
      })
      this.service.delete(item, idItems).subscribe(
        responce => {
          //Закрытие окна настройки пункта меню
          this.service.settingsMenu = false
          //Обнуляем массив для следующего удаления
          this.arr = []
          MaterialService.toast('Удалено успешно')
        },
        error => MaterialService.toast(error.error.message),
      )
    }
  }

  private recursionFunc(item: NavItemNew) {
    this.service.menuItemsOld.forEach((item2) => {
      if (item2.parent_id == item.id) {
        this.arr.push(item2)
        this.recursionFunc(item2)
      }
    })
  }

  /**
  * Функция обновления массива меню на фронте ()используется при каждом удалении или давлении нового пункта меню
  */
  updateMenuItems() {
    let map = new Map()
    //Сначала обнуляем массив, потому что создаём его заново уже с новым элементом
    this.service.menuItems = []
    //Первые уровни меню
    this.service.menuItemsOld.forEach((item) => {
      let navItem: NavItemNew = {
        id: item.id, title: item.title, url: item.url,
        subtitle: [], parent_id: item.parent_id
      }
      map.set(item.id, navItem)
      if (item.parent_id == null) {
        this.service.menuItems.push(navItem)
      }
    })
    this.service.menuItemsOld.forEach((item) => {
      if (item.parent_id !== null) {
        let obj = map.get(item.parent_id)
        obj.subtitle.push(map.get(item.id))
      }
    })
  }


  addNew(item: NavItemNew) {
    this.data = item
    this.newItem = true;
  }

  closeModal() {
    this.service.settingsMenu = false
    this.newItem = false;

    //Обнуляем значения модального окна при закрытии
    this.form = this.fb.group({
      read: false,
      write: false,
      delete: false,
    });

    //Обнуляем список пользователей
    this.toppings.reset()
  }

  closeAddModal() {
    this.newItem = false
  }

  setValue(value: string) {
    this.inputValue = value
  }

}
