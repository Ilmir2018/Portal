import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataFields, GridColumnDefinition, Widget } from 'src/app/interfaces';
import { WidgetsService } from 'src/app/services/widgets.service';

@Component({
  selector: 'app-choise-widget-type-read-page',
  templateUrl: './choise-widget-type-read-page.component.html',
  styleUrls: ['./choise-widget-type-read-page.component.scss']
})
export class ChoiseWidgetTypeReadPageComponent implements OnInit {

  @Input() widgets: [Widget];
  $builder: Observable<DataFields[]>;
  widgetData: DataFields[] = [];
  @Input() dataSource: MatTableDataSource<any>;
  columns: GridColumnDefinition[] = [];
  displayedColumns: string[] = [];

  constructor(private service: WidgetsService) { }

  ngOnInit(): void {
    this.$builder = this.service.getWidget(this.widgets[0].id).pipe(
      map((data: DataFields) => {
        data.fields.forEach((item, idx) => {
          let divider = 10
          if (data.fields.length > 4 && data.fields.length < 8) {
            divider = 15
          } else if (data.fields.length > 8) {
            divider = 30
          }
          // if(item.name !== 'Column 1') {
            this.columns.push({ field: item.name, actualWidth: 100 * data.fields.length / divider, name: item.name, show: true, order: idx })
          // }
        })
        // data.data.forEach((rowElement) => {
        //   delete rowElement['Column 1']
        // })
        this.setDisplayedColumns();
        this.dataSource = new MatTableDataSource<any>(data.data)
        return [...this.widgetData]
      })
    );
  }

  trackByFn(index: number): number {
    return index;
  }

  //Функция задания отображаемых колонок
  setDisplayedColumns(): void {
    this.displayedColumns = [];
    this.columns.forEach((column: GridColumnDefinition, index: number) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
  }

  sendChanges(value, row, field) {
    console.log(this.widgets[0].id)
    console.log(value, row, field)
  }

}
