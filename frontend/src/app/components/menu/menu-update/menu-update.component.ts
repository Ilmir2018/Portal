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

  @Input() public navItems: NavItem;
  public inputValue: string

  constructor(private service: MenuService) {
  }

  ngOnInit(): void {
  }

  save(object: NavItem, id?: string) {
    console.log(object)
    // object.forEach((item) => {
    //   if (this.inputValue !== undefined && item._id === id) {
    //       if (title === item.title) {
    //         item.title = this.inputValue
    //         console.log(this.inputValue)
    //         item.url = this.translit(item.title)
    //          // необходимо так же обновлять конфиг AppRoutingModule, т.к. url 
    //          //тоже обновляется вместе с названием
    //       }
    //       this.update(item)
    //   } else if(item._id === id) {
    //     //Изначально значение равно тому что приходит из базы
    //     this.setValue(title)
    //     this.update(item)
    //   }
    // })
    this.service.navItems.forEach(() => {

    })

    if (this.inputValue !== undefined && this.inputValue !== object.title) {
      object.title = this.inputValue
      object.url = this.translit(object.title)
      this.update(object)
    } else {
      this.setValue(object.title)
    }
  }

  /**
   * Функция обновления объекта в базе
   * @param item Обновляемый объект
   */
  update(item) {
    this.service.update(item._id, item).subscribe(
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
