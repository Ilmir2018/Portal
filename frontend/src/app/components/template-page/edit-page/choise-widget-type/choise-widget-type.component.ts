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
  openCreatingWidget: boolean = false;

  constructor(public service: WidgetsService) { }

  ngOnInit(): void {
  }

  choiseWidget(type: string) {
    this.openCreatingWidget = true;
    this.service.choiseWidgetTypeModal = false;
    this.service.widgetType = type
  }

  closeModal() {
    this.service.choiseWidgetModal = false;
    this.openCreatingWidget = false;
    document.body.classList.remove('hidden')
  }

  ngOnDestroy(): void {
    this.service.choiseWidgetModal = false;
  }
}
