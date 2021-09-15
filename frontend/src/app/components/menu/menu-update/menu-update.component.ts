import { Component, Input, OnInit } from '@angular/core';
import { MaterialService } from 'src/app/classes/material.service';
import { NavItem } from 'src/app/interfaces';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})
export class MenuUpdateComponent implements OnInit {

  public inputValue: string
  public postgresMenu: any
  @Input() public menuItems: any;
  public second_step = [];
  public newItem = false

  constructor(private service: MenuService) {}

  ngOnInit(): void {}

  /**
   * Функция обновления объекта в базе
   * @param item Обновляемый объект
   */
  save(item) {
    item.title = this.inputValue
    item.url = this.translit(this.inputValue)
    this.service.update(item).subscribe(
      menu => {
        MaterialService.toast('Изменения сохранены')
      }, error => {
        MaterialService.toast(error.error.message)
      }
    )
  }

  add(item: string) {
    console.log('Добавление пункта меню' + item)
  }

  remove(item: string) {
    console.log('Удаление пункта меню' + item)
  }

  setValue(value: string) {
    this.inputValue = value
  }

  addNew() {
    this.newItem = true;
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

    return "/" + answer.toLowerCase();
  }

}
