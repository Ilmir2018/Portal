import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { WidgetsService } from 'src/app/services/widgets.service';
import { Container, ReadPageOutput } from '../../../interfaces';

@Component({
  selector: 'app-read-page',
  templateUrl: './read-page.component.html',
  styleUrls: ['./read-page.component.scss']
})
export class ReadPageComponent implements OnInit {

  readerOutput: ReadPageOutput[] = []
  isVisible: boolean = true
  widgetsCount: string

  constructor(public service: WidgetsService, private route: ActivatedRoute) {
    this.readerOutput = []
  }

  /**
   * Формируем контейнеры для отображения на странице
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.service.$builder = this.service.getWidgets(params.pageName).pipe(
        map((containers: Container[]) => {
          containers.forEach((container: Container) => {
            this.readerOutput.push({ containerId: container.id, containerType: container.type, elements: container.elements })
          })
          return [...this.service.containers]
        })
      );
    })
  }

  /**
   * Определяем тип контейнера
   */
  definitionContainerType(container: Container): string {
    let type = 'type';
    if (container.elements !== undefined) {
      container.elements.forEach((element, idx) => {
        if (element.widgets.length !== 0) {
          type = type + (idx + 1)
        }
      })
    }
    return type;
  }

}
