import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { WidgetsService } from 'src/app/services/widgets.service';
import { Container } from '../../../interfaces';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

  maxHeight: boolean = false

  constructor(public service: WidgetsService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.service.$builder = this.service.getWidgets(params.pageName).pipe(
        map((arr: Container[]) => {
          this.service.containers = []
          this.service.containers.push(...arr)
          this.maxHeight = false
          if(this.service.containers.length <= 1) {
            this.maxHeight = true
          }
          return [...this.service.containers]
        })
      );
    })
  }

  choiseTypeContainer() {
    this.service.choiseContainerModal = true;
    document.body.classList.add('hidden')
    this.service.selectedContainer = null
  }

}
