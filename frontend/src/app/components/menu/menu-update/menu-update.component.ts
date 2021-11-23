import { Component, Input, OnInit } from '@angular/core';
import { NavItemNew } from 'src/app/interfaces';
import { MenuService } from 'src/app/services/menu.service';


@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})
export class MenuUpdateComponent implements OnInit {

  @Input() public menuItems: NavItemNew;

  constructor(private service: MenuService) { }

  ngOnInit(): void { }

  settings(item) {
    this.service.settingsMenu = true
    this.service.settingsItem = item
    let permissions = JSON.parse(localStorage.getItem('permissions'))
    let permission;
    //Получаем массив разрешений на (чтение, запись и удаление)
    permissions.forEach((item) => {
      if (item.url == this.service.settingsItem.url) {
        permission = item
        this.service.writePerm = permission.permissions[1]
        this.service.deletePerm = permission.permissions[2]
      } else {
        return
      }
    })
    //Берём права на редактирование и удаление каждого открывающегося
    // пункта меню и передаём в модальное окно через сервис

  }


}
