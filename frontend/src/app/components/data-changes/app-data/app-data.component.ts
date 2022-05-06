import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DataFields, NewTable } from 'src/app/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { GridColumnDefinition } from 'src/app/interfaces';



@Component({
  selector: 'app-app-data',
  templateUrl: './app-data.component.html',
  styleUrls: ['./app-data.component.scss']
})

export class AppDataComponent implements OnInit, OnDestroy {

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

  constructor(private service: DataService) { }


  ngOnInit(): void {
    //Подгружаем названия всех таблиц
    this.service.get().subscribe((data: NewTable[]) => {
      this.dataTypes = data
    })
  }

  /**
   * Функция отображаемой таблицы по клику
   * @param title Название выводимой таблицы
   */
  changeType(title: string): void {
    this.type = title
    this.oSub = this.service.getData(title).subscribe((data: DataFields) => {
      this.columns = []
      //Создаём колонки с помощью значения, приходящего с бэка
      data.fields.forEach((item, idx) => {
        let divider = 10
        if (data.fields.length > 4 && data.fields.length < 8) {
          divider = 15
        } else if (data.fields.length > 8) {
          divider = 30
        }
        this.columns.push({ field: item.name, width: 100 * data.fields.length / divider, name: item.name, show: true, order: idx })
      })
      this.setDisplayedColumns();
      //Добавляем пустую строку снизу
      data.data.push({})
      //Заполняем данными поля таблицы
      this.dataSource = new MatTableDataSource<any>(data.data)
      //Определяем ширину колонок
      this.columns.forEach((column: GridColumnDefinition) => {
        column.actualWidth = column.width;
      });
    })
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

  /**
   * Функция отправки на сервер изменённых в таблице данных
   * @param changes изменённое значение
   * @param row изменённая строка, берём оттуда id
   * @param column название изменяемой колонки
   */
  sendChanges(changes: string | number, row: any, column: string) {
    let data = []
    data.push({ changes: changes }, { id: row.id }, { column: column }, { table: this.type })

    this.oSub = this.service.getData(this.type).subscribe((data: DataFields) => {
      //Заполняем данными поля таблицы
      this.dataSource = new MatTableDataSource<any>(data.data)
      this.dataSource.data.push({})
    })
    //если row.id == undefined то добавляем новую строку
    if (row.id == undefined) {
      this.service.addUpdateField(data, true).subscribe((data) => {
        //Добавляем новую строчку на фронте
        this.dataSource.data.push(data)
        this.dataSource._updateChangeSubscription()
      })
    } else {
      this.service.addUpdateField(data, false).subscribe((data) => {
      })
    }
  }

  ngOnDestroy(): void {
    if(this.oSub) {
      this.oSub.unsubscribe()
    }
  }

}
