import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NavItemNew } from 'src/app/interfaces';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu-update-item',
  templateUrl: './menu-update-item.component.html',
  styleUrls: ['./menu-update-item.component.scss']
})
export class MenuUpdateItemComponent implements OnInit {


  @Input('onDragDrop') public onDragDrop$!: Subject<CdkDragDrop<Array<NavItemNew>>>;
  @Input() item!: NavItemNew;
  @Input() invert!: boolean;

  constructor(private service: MenuService) { }

  ngOnInit(): void {
  }

  /**
   * Функция открытия окна редактирования пункта меню
   * @param item пункт меню
   */
  settings(item) {
    this.service.settingsMenu = true
    this.service.settingsItem = item
    let permissions = JSON.parse(localStorage.getItem('permissions'))
    let permission;
    //Получаем массив разрешений на (чтение, запись и удаление)
    permissions.forEach((item) => {
      if (item.url == this.service.settingsItem.url) {
        permission = item
        if (permission.permissions[2] == true) {
          this.service.writePerm = true
        }
      } else {
        return
      }
    })

    this.service.getContacts(item)
    //Добавляем класс в body чтобы убрать прокрутку при открытии модального окна
    document.body.classList.add('hidden')
  }


}
