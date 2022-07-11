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
    this.service.$builder = this.service
      .deleteElementAndWidgets(element)
      .pipe(map((type: string) => {
        //Удаляем лишний элемент и перезаписываем билдер
        this.service.containers.filter(container => {
          return container.elements.forEach((item, idx) => {
            if(item.id === element.id) {
              container.type = type
              container.elements.splice(idx, 1)
            }
          })
        })
        return [... this.service.containers]
      }))
  }

  deleteContainer(container_id: number) {
    this.service.$builder = this.service
      .deleteContainer(container_id)
      .pipe(map((type: string) => {
        //Удаляем лишний элемент и перезаписываем билдер
        this.service.containers.filter((container, idx) => {
          if(container.id === container_id) {
            this.service.containers.splice(idx, 1)
          }
        })
        return [... this.service.containers]
      }))
  }

  addElementFromContainer() {

  }

}
