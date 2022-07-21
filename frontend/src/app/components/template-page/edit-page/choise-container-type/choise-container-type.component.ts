import { Component, Input, OnInit } from '@angular/core';
import { Builder, Container, Element } from 'src/app/interfaces';
import { WidgetsService } from 'src/app/services/widgets.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-choise-container-type',
  templateUrl: './choise-container-type.component.html',
  styleUrls: ['./choise-container-type.component.scss']
})
export class ChoiseContainerTypeComponent implements OnInit {

  @Input() container: Container;
  isVisible: boolean = true

  constructor(public service: WidgetsService) { }

  ngOnInit(): void { }

  visibleBtn(visible: boolean) {
    this.isVisible = visible
  }

  choiseContainerType(container: Container) {
    this.service.choiseContainerModal = true;
    document.body.classList.add('hidden')
    this.service.selectedContainer = container
  }

  deleteElement(element: Element) {
    //Фильтрация виджетов перед отправеой на сервер
    element.widgets = element.widgets.filter((widget) => {
      return widget.id !== null
    })
    this.service.$builder = this.service
      .deleteElementAndWidgets(element)
      .pipe(map((type: string) => {
        //Удаляем элемент и перезаписываем билдер
        this.service.containers.filter(container => {
          return container.elements.forEach((item, idx) => {
            if(item.id === element.id) {
              container.type = 'three'
              container.elements.splice(idx, 1)
            }
          })
        })
        return [... this.service.containers]
      }))
  }

  deleteContainer(container: Container) {
    this.service.$builder = this.service
      .deleteContainer(container)
      .pipe(map((type: string) => {
        //Удаляем контейнер и перезаписываем билдер
        this.service.containers.filter((item, idx) => {
          if(container.id === item.id) {
            this.service.containers.splice(idx, 1)
          }
        })
        return [... this.service.containers]
      }))
  }

  addElementFromContainer() {

  }

}
