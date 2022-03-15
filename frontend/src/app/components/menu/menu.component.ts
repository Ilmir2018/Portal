import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';
import { MenuService } from 'src/app/services/menu.service';
import { TemplatePageComponent } from '../template-page/template-page.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  private inputValue: string

  constructor(public service: MenuService, private router: Router) { }

  ngOnInit(): void { }

  setValue(value: string) {
    this.inputValue = value
  }

  add() {
    let arr = []
    //Берём имеющиеся пункты меню для определения уровня элементов
    this.service.menuItemsOld.forEach((item) => {
      if (item.parent_id == null) {
        arr.push(item)
      }
    })
    let forBack = { title: this.inputValue, url: this.service.translit(this.inputValue), parent_id: null, level: (arr.length).toString() }
    //Изменяем мааасив permissions в localstorage
    let permissions = JSON.parse(localStorage.getItem('permissions'))
    permissions.push({ url: this.service.translit(this.inputValue), permissions: [false, true, false] })
    localStorage.setItem('permissions', JSON.stringify(permissions))
    //Формируем url для добавления в массив роутов
    let url = this.service.translit(this.inputValue);
    //Добавляем новый адрес в массив роутов
    this.router.config.forEach((item) => {
      if (item.canActivate) {
        item.children.push({ path: url, component: TemplatePageComponent })
      }
    })
    this.service.add(forBack).subscribe(
      newItem => {
        newItem.subtitle = []
        this.service.menuItems.push(newItem)
        this.service.menuItemsOld.push(newItem)
        MaterialService.toast('Изменения сохранены')
      },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
  }

}
