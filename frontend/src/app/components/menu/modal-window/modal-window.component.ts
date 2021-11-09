import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';
import { NavItemNew } from 'src/app/interfaces';
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

  constructor(public service: MenuService, private router: Router) { }

  ngOnInit(): void {
    this.forbiddenItems = ['contacts', 'menu', 'profile', 'settings']
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
      this.service.delete(item).subscribe(
        responce => {
          //Удаление элемена на фронте
          const idx = this.service.menuItemsOld.findIndex(p => p.id === item.id)
          this.service.menuItemsOld.splice(idx, 1)
          this.updateMenuItems()
          //перезагрузка экрана, т.к. пока не придумал как удалить все подмассивы,
          //если удалаяется большой вложенный объект
          location.reload();
          MaterialService.toast('Удалено успешно')
        },
        error => MaterialService.toast(error.error.message),
      )
    }
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
  }

  closeAddModal() {
    this.newItem = false
  }

  setValue(value: string) {
    this.inputValue = value
  }

}
