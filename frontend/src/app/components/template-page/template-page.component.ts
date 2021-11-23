import { Component, OnChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ContactsService } from 'src/app/services/contacts.service';
import { MaterialService } from 'src/app/classes/material.service';


@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.scss']
})
export class TemplatePageComponent {

  constructor(private router: Router, private service: ContactsService) { }


  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  send() {
    // this.router.navigate(['/contacts'])
    setTimeout(() => {
      this.service.create({
        name: 'string',
        firm: 'string',
        email: 'string@dgdg',
        password: 'stringgfd'
      }).subscribe(
        contact => {
          MaterialService.toast('Изменения сохранены')
          this.router.navigate(['/contacts'])
        },
        error => {
          MaterialService.toast(error.error.message)
        }
      )
    }, 500)
  }
}
