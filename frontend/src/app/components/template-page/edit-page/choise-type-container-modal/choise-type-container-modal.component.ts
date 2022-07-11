import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { WidgetsService } from 'src/app/services/widgets.service';
import { Container } from '../../../../interfaces';

@Component({
  selector: 'app-choise-type-container-modal',
  templateUrl: './choise-type-container-modal.component.html',
  styleUrls: ['./choise-type-container-modal.component.scss']
})
export class ChoiseTypeContainerModalComponent implements OnInit {

  containerTypes: string[] = ['one', 'two', 'three'];

  constructor(private service: WidgetsService) { }

  ngOnInit(): void {
  }

  addContainerAndElements(type: string) {
    this.service.choiseContainerModal = false;
    document.body.classList.remove('hidden')
    this.service.$builder = this.service
      .addContainerAndElements(this.service.selectedContainer.page_id, type)
      .pipe(map((container: [Container]) => {
        console.log(container[0])
        this.service.containers.push(container[0])
        return [...this.service.containers]
      }))
  }

  closeModal() {
    this.service.choiseContainerModal = false;
    document.body.classList.remove('hidden')
  }

}
