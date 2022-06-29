import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WidgetsService } from 'src/app/services/widgets.service';
import { Builder, Container } from '../../../interfaces';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  $builder: Observable<Container[]>;
  choiseModal: boolean = false;
  containers: Container[] = [];

  constructor(private service: WidgetsService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {
      this.$builder = this.service.getWidgets(params.pageName).pipe(
        map(arr => {
          this.containers.push(arr)
          return [...this.containers]
        })
      );
    })
  }

  choiseTypeContainer() {
    this.choiseModal = true;
    document.body.classList.add('hidden')
  }

  ngOnDestroy(): void {
  }
}
