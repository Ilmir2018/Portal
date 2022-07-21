import { Component, Input, OnInit } from '@angular/core';
import { Container } from 'src/app/interfaces';

@Component({
  selector: 'app-choise-container-type-read-page',
  templateUrl: './choise-container-type-read-page.component.html',
  styleUrls: ['./choise-container-type-read-page.component.scss']
})
export class ChoiseContainerTypeReadPageComponent implements OnInit {


  @Input() container: Container;
  type: string

  constructor() { }

  ngOnInit(): void {
    this.definitionElementType(this.container)
  }

  definitionElementType(container: Container) {
    let type = 'type';
    let idx = 1
    if (container.elements !== undefined) {
      container.elements.forEach((element) => {
        if (element.widgets.length !== 0) {
          this.type = type + (idx)
          idx++;
        }
      })
    }
  }

}
