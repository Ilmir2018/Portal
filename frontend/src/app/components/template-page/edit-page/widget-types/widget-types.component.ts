import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { GridColumnDefinition, NewTable, WidgetData } from 'src/app/interfaces';
import { WidgetsService } from 'src/app/services/widgets.service';

@Component({
  selector: 'app-widget-types',
  templateUrl: './widget-types.component.html',
  styleUrls: ['./widget-types.component.scss']
})
export class WidgetTypesComponent implements OnInit {

  disableSelect = new FormControl(false);
  rows: number = 3;
  col: number = 3;
  formGroup: FormGroup;
  //Изеняемая таблица
  type: string
  //Массив всех таблиц
  public dataTypes: NewTable[] = [];
  //Содержимое выбранной таблицы
  @Input() dataSource: MatTableDataSource<any>;
  oSub: Subscription
  //Колонки выбранной таблицы
  public columns: GridColumnDefinition[] = [];
  //Колонки выбранной таблицы
  displayedColumns: string[] = [];
  dataRows = []
  colValue: string

  constructor(private service: WidgetsService) { }

  ngOnInit(): void {
    for (let column = 1; column <= this.col; column++) {
      this.columns.push({ field: 'Column ' + column, actualWidth: 30, name: 'Column ' + column, show: true, order: 1 })
      let rowElement = {};
      for (let row = 1; row <= this.rows; row++) {
        rowElement['Column ' + row] = 'Column ' + row + ' Value';
      }
      this.dataRows.push(rowElement)
      this.dataSource = new MatTableDataSource<any>(this.dataRows)
    }
    this.setDisplayedColumns();
  }

  closeModal(): void {
    this.service.choiseWidgetModal = false;
    document.body.classList.remove('hidden')
  }

  increaseRowsCount(): void {
    this.rows++;
    let rowElement = {};
    this.columns.forEach((columnElement) => {
      rowElement[columnElement.field] = columnElement.field + ' Value';
    })
    this.dataRows.push(rowElement)
    this.dataSource = new MatTableDataSource<any>(this.dataRows)
  }

  decreaseRowsCount(): void {
    this.rows--;
    this.dataRows.splice(this.rows, 1)
    this.dataSource = new MatTableDataSource<any>(this.dataRows)
  }

  /**
   * Прежде чем изменить колонку когда убиравется курсор с изменной строки, нужно 
   * обновлять массив this.data 
   * добавляемая колонка добавляет на данный момент значения только в эту колонку
   */
  increaseColumnCount(): void {
    this.col++;
    this.columns.push({ field: 'Column ' + this.col, actualWidth: 30, name: 'Column ' + this.col, show: true, order: 1 })
    this.dataRows.forEach((element, idx) => {
      element['Column ' + this.col] = 'Column ' + this.col + ' Value';
    })
    this.setDisplayedColumns();
  }

  decreaseColumnCount(): void {
    this.col--;
    this.columns.splice(this.col, 1)
    this.dataRows.forEach((element) => {
      delete element['Column ' + (this.col + 1)]
    })
    this.setDisplayedColumns();
  }

  //Функция задания отображаемых колонок
  setDisplayedColumns(): void {
    this.displayedColumns = [];
    this.columns.forEach((column: GridColumnDefinition, index: number) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
  }

  /**
   * Функция изменения имен колонок
   * @param changesName измененное название
   * @param index индекс элемента
   * @param columns массив колонок
   */
  changeColumnValue(changesName: string, columName: string, index: number, columns: GridColumnDefinition[]): void {
    columns.forEach((columnElement, idx) => {
      if (idx === index) {
        columnElement.name = changesName;
        columnElement.field = changesName;
        this.dataRows.forEach((rowElement) => {
          delete rowElement[columName]
          rowElement[changesName] = columName + ' Value'
        })
      }
    })
    this.setDisplayedColumns();
    this.dataSource = new MatTableDataSource<any>(this.dataRows)
  }

  /**
   * Иземенение значения ячейки
   * @param changesName изменяемое значение
   * @param row строка которую меняем
   * @param columnField название колонки в которой меняем 
   */
  changeRowValue(changesName: string, row: string, columnField: string): void {
    row[columnField] = changesName
  }

  /**
 * Отпраляем на бэк колнки, данные, название таблицы, которая получается из 
 * названия страницы + номер элемента + номер контейнера
 * У нас получается виджет с id страницы на которой он был создан
 * Потом при просмотрре страницы мы делаем запрос на бэк и ищем виджет
 * сохраняем в таблицу виджетов id елемента и создаем там запись
 * 
 */
  saveWidget(): void {
    this.service.choiseWidgetModal = false;
    document.body.classList.remove('hidden')
    const columns: string[] = [];
    this.columns.forEach((columnElement: GridColumnDefinition) => {
      columns.push(columnElement.field)
    })
    columns.unshift('id')
    const data: WidgetData = {columns: columns, rows: this.dataRows, 
      elementId: this.service.element_id, widgetType: this.service.widgetType}
    this.service.creatingWidget(data).subscribe((response) => {
      console.log(response)
    })
  }

  trackByFn(index: number): number {
    return index;
  }

  ngOnDestroy(): void {
    this.service.choiseWidgetModal = false;
    this.service.element_id = null
  }
}
