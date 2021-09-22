import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  private inputValue: string

  constructor(public service: MenuService, private router: Router) { }

  ngOnInit(): void {}

  setValue(value: string) {
    this.inputValue = value
  }

  add() {
    let object = { title: this.inputValue, url: this.service.translit(this.inputValue), parent_id: null }
    this.service.add(object).subscribe(
      newItem => {
        newItem.subtitle = []
        this.service.menuItems.push(newItem)
        MaterialService.toast('Изменения сохранены')
      },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
  }

}
