import { Component, Input, OnInit } from '@angular/core';
import { Builder, Container } from 'src/app/interfaces';

@Component({
  selector: 'app-choise-container-type',
  templateUrl: './choise-container-type.component.html',
  styleUrls: ['./choise-container-type.component.scss']
})
export class ChoiseContainerTypeComponent implements OnInit {

  @Input() container: Container;

  constructor() { }

  ngOnInit(): void {
    console.log(this.container)
  }

}
