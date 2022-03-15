import { CdkDragDrop, CdkDragEnd, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MaterialService } from 'src/app/classes/material.service';
import { NavItemNew } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';
import { MenuService } from 'src/app/services/menu.service';


export interface sendItems {
  id: string
  level: string
}

@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})

export class MenuUpdateComponent implements OnInit {

  //Массив для отправки на бек, для изменения значения level
  private sendArray: Array<sendItems> = [];
  public invert: boolean = true;
  public onDragDrop$ = new Subject<CdkDragDrop<Array<NavItemNew>>>();

  constructor(public service: MenuService, public contactService: ContactsService) { }

  ngOnInit(): void {
    this.onDragDrop$.subscribe(this.onDragDrop);
  }

  private onDragDrop = (event: CdkDragDrop<Array<NavItemNew>>) => {
    if (event.container === event.previousContainer) {
      //Если мы перемещаем элемент на одном уровне, не меняя его вложенность
      //Здесь будет меняться только значение level, тоесть порядок на одном уровне вложенности
      this.sendArray = []
      setTimeout(() => {
        event.container.data.forEach((item, idx) => {
          this.sendArray.push({ id: item.id, level: idx.toString() })
        })
        this.moveItem(this.sendArray)
      }, 1)
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      //Если мы меняем вложенность элемента, либо выше либо ниже
      //Здесь будет меняться и level и parent_id
      setTimeout(() => {
        if (event.container.id == "cdk-drop-list-0") {
          this.transferArray(event.container.data, null)
        } else {
          this.transferArray(event.container.data, event.container.id)
        }
      }, 1)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  };

  //Метод для работы с бэком, если изменения происходят в одном родителе level
  private moveItem(data: sendItems[]) {
    console.log(data)
    this.service.changeMenuStructure(data, null, false).subscribe(
      changeStructure => { },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
  }

  //Метод для работы с бэком, если меняется parent_id
  private transferArray(elements: NavItemNew[], parent_id: string) {
    this.service.changeMenuStructure(elements, parent_id, true).subscribe(
      changeStructure => { },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
  }


}
