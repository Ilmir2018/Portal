import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { NavItemNew } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';
import { MenuService } from 'src/app/services/menu.service';


@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})
export class MenuUpdateComponent implements OnInit {

  @Input() public menuItems: NavItemNew;

  constructor(private service: MenuService, public contactService: ContactsService) { }

  ngOnInit(): void { }

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
        if (permission.permissions = [false, false, true]) {
          this.service.writePerm = true
        }
      } else {
        return
      }
    })

    //Метод вызываемый для управления правами доступа
    this.service.getContacts(item)
    
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      console.log(event.previousContainer, '1')
      console.log(event.container, '2')
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('sdvsddsf')
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


}
