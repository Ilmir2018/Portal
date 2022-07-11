import { Container } from '../../../../interfaces';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { WidgetsService } from 'src/app/services/widgets.service';

@Component({
  selector: 'app-choise-widget-type',
  templateUrl: './choise-widget-type.component.html',
  styleUrls: ['./choise-widget-type.component.scss']
})
export class ChoiseWidgetTypeComponent implements OnInit , OnDestroy {

  widgetTypes: string[] = ['table'];

  constructor(private service: WidgetsService) { }

  ngOnInit(): void {
  }

  choiseWidget() {
    console.log('choiseWidget')
  }

  closeModal() {
    this.service.choiseWidgetModal = false;
    document.body.classList.remove('hidden')
  }

  ngOnDestroy(): void {
    this.service.choiseWidgetModal = false;
  }
}
