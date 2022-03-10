import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NavItemNew } from 'src/app/interfaces';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.scss']
})

export class TemplatePageComponent implements OnInit {

  public data: Array<NavItemNew> = [];

  public invert: boolean = true;
  public onDragDrop$ = new Subject<CdkDragDrop<Array<NavItemNew>>>();

  constructor(private service: MenuService){
  }

  ngOnInit(): void {
      this.data = this.service.menuItems

      this.onDragDrop$.subscribe(this.onDragDrop);
  }

  private onDragDrop = (event: CdkDragDrop<Array<NavItemNew>>) => {
    if (event.container === event.previousContainer) {
      //Если мы перемещаем элемент на одном уровне, не меняя его вложенность
      //Здесь будет меняться только значение level, тоесть порядок на одном уровне вложенности
      console.log('moveItemInArray')
      // console.log('event.container', event.container)
      // console.log('event.previousContainer', event.previousContainer)
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      //Если мы меняем вложенность элемента, либо выше либо ниже
      //Здесь будет меняться и level и parent_id
      console.log('transferArrayItem')
      // //Контейнер куда перемещаем элемент
      // console.log('event.container', event.container)
      // //Контейнер откуда перемещаем элемент
      // console.log('event.previousContainer', event.previousContainer)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  };
}