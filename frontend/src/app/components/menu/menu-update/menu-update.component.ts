import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';
import { NavItemNew } from 'src/app/interfaces';
import { MenuService } from 'src/app/services/menu.service';
import { TemplatePageComponent } from '../../template-page/template-page.component';

@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})
export class MenuUpdateComponent implements OnInit {

  public inputValue: string
  @Input() public menuItems: NavItemNew;
  public newItem = false
  data: NavItemNew
  private deleteObjects = []
  public contacts = 'contacts'

  constructor(private service: MenuService, private router: Router) { }

  ngOnInit(): void {

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
    let object = { title: this.inputValue, url: this.service.translit(this.inputValue), parent_id: item.id, user_id: localStorage.getItem('id-user') }
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
        console.log(this.router.config)
      },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
    this.newItem = false;
    console.log(this.router.config)
  }

  /**
   * Функция удаления пунктов меню
   * @param item пункт меню
   */

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

  setValue(value: string) {
    this.inputValue = value
  }

  addNew(item: NavItemNew) {
    this.data = item
    this.newItem = true;
  }

  /**
   * Функция добавления нового элемента в общий массив меню
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

}
