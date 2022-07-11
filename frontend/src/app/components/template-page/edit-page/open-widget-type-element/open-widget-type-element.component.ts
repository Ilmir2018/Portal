import { Component, Input, OnInit } from '@angular/core';
import { Element, Widget } from 'src/app/interfaces';
import { WidgetsService } from 'src/app/services/widgets.service';

@Component({
  selector: 'app-open-widget-type-element',
  templateUrl: './open-widget-type-element.component.html',
  styleUrls: ['./open-widget-type-element.component.scss']
})
export class OpenWidgetTypeElementComponent implements OnInit {

  
  @Input() widgets: Widget[];
  @Input() element: Element;

  constructor(private service: WidgetsService) { }

  ngOnInit(): void {
    if(this.widgets.length === 0) {
      this.widgets.push({id: null, element_id: null, type: null});
    }
  }

  addNewWidget(element: Element) {
    this.service.choiseWidgetModal = true
  }

  openCurrentWidget(widget: Widget) {
    console.log(widget)
  }

}
