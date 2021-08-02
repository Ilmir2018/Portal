import { Component, ElementRef, HostListener, Input, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ContactsService } from 'src/app/services/contacts.service';
import { Contact, GridColumnDefinition } from '../../../interfaces';

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.scss']
})
export class ContactsTableComponent implements OnInit {

  @ViewChild(MatTable, { read: ElementRef, static: true }) private matTableRef: ElementRef;
  @ViewChildren('MatTableRowRef') matTableRow: QueryList<any>;
  @Input() dataSource: MatTableDataSource<Contact>;
  columns: GridColumnDefinition[] = [];
  @Input() cellTemplateRef: TemplateRef<any>;
  @Input() addRemoveColumn = true;
  @Input() infiniteScroll: boolean;
  @Input() totalPages = 10;
  @Input() resizable = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filters: string[] = ['name', 'firm', 'email']
  oSub: Subscription
  reloading: boolean = false
  phone = 'phone'

  currentPage = 1;
  displayedColumns: string[] = [];
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  subscriptions: Subscription[] = [];

  removedColumns: GridColumnDefinition[] = [];
  data: MatTableDataSource<any>;

  constructor(private renderer: Renderer2, private service: ContactsService) {
    this.columns = this.service.columns
    this.service.changedColumns = this.columns
    //Из кэша получаем сохранённые настройки по ширине столбцов
    if(JSON.parse(localStorage.getItem('widthChange'))) {
      if(JSON.parse(localStorage.getItem('widthChange')).length !== 0) {
        this.columns = JSON.parse(localStorage.getItem('widthChange'))
      }
      
    }
  }

  ngOnInit(): void {
    this.reloading = true
    this.oSub = this.service.getContacts().subscribe(contacts => {
      this.dataSource = new MatTableDataSource<Contact>(contacts)
      this.reloading = false
      this.setDataSource(this.dataSource);
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      
    })
  }

  setDataSource(dataSource: MatTableDataSource<Contact>): void {
    if (!dataSource) {
      return;
    }
    dataSource.data = this.addRemoveColumn ? dataSource.data.map((element: any) => {
      element.plusAction = '';
      return element;
    }) : dataSource.data;
    this.data = dataSource;
    this.setDisplayedColumns();
  }

  //Функция задания ширины
  //tableWidth - это ширина таблицы
  setTableResize(tableWidth: number): void {
    let totalWidth = 0;
    let arr = []
    totalWidth = this.columns.reduce((a, b) => {
      return a + b.width;
    }, 0);
    const scale = (tableWidth - 5) / totalWidth;
    this.columns.forEach((column: GridColumnDefinition) => {
      column.actualWidth = column.width * scale;
      arr.push(+column.actualWidth.toFixed(2))
      this.setColumnWidth(column);
    });
  }


  setDisplayedColumns(): void {
    this.displayedColumns = [];
    console.log(this.columns)
    this.columns.forEach((column: GridColumnDefinition, index: number) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  //Проверка на нажатие клавиши
  onResizeColumn(event: MouseEvent, index: number): void {
    if (!this.resizable) {
      return;
    }
    const eventParent = (event.target as HTMLInputElement).parentElement;
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = eventParent.clientWidth;
    event.preventDefault();
    this.mouseMove(index);
  }


  private checkResizing(event: MouseEvent, index: number): void {
    //Данные которые есть изначально`
    const cellData = this.getCellData(index);
    // console.log(cellData)
    if ((index === 0) || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.columns.length - 1)) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number): DOMRect {
    const headerRow = this.matTableRef.nativeElement.children[0];
    const cell = headerRow.children[index];
    return cell.getBoundingClientRect();
  }

  //Функция для отслеживания событий mousemove и mouseup
  mouseMove(index: number): void {
    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 50) {
          this.setColumnWidthChanges(index, width);
        }
      }
    });
    this.resizableMouseup = this.renderer.listen('document', 'mouseup', () => {
      console.log('mouseup')
      // const cellData = this.getCellData(index);

      if (this.pressed) {
        this.pressed = false;
        this.currentResizeIndex = -1;
        this.resizableMousemove();
        // this.resizableMouseup();
        document.querySelectorAll('.mat-cell, mat-header-cell').forEach((el: HTMLElement) => el.style.borderRight = 'unset');
      }
    });
  }


  setColumnWidthChanges(index: number, width: number): void {
    if (!this.columns || (index + 1 === this.columns.length)) {
      return;
    }
    const orginalWidth = this.columns[index].actualWidth;
    const dx = width - orginalWidth;
    if (dx !== 0) {
      const j = (this.isResizingRight) ? index + 1 : index - 1;
      const newWidth = this.columns[j].actualWidth - dx;
      if (newWidth > 50) {
        this.columns[index].actualWidth = width;
        this.setColumnWidth(this.columns[index]);

        Array.from(document.getElementsByClassName('mat-column-' + this.columns[index].field))
          .forEach((el: HTMLDivElement) => el.style.borderRight = '1px dotted black');

        this.columns[j].actualWidth = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
    }
    //Меняем ширину каждого столбца
    this.service.changedColumns.forEach((element, idx) => {
      if (index == idx) {
        element.width = orginalWidth
      }
    })
    //Изменённые данные
    localStorage.setItem('widthChange', JSON.stringify(this.service.changedColumns))
    console.log(orginalWidth)
    console.log(this.columns)
  }

  setColumnWidth(column: GridColumnDefinition): void {
    of(this.matTableRef)
      .pipe(delay(1))
      .subscribe(x => {
        const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.field));
        if (columnEls) {
          columnEls.forEach((el: HTMLDivElement) => {
            el.style.width = column.actualWidth + 'px';
          });
        }
      });
  }

  setAddColumns(columns: GridColumnDefinition[]): GridColumnDefinition[] {
    if (!columns || columns.length === 0) {
      return [];
    }
    const plusActionExist = columns.find(c => c.field === 'plusAction') as GridColumnDefinition;
    const maxOrder = columns.reduce((max, p) => p.order > max ? p.order : max, columns[0].order);
    if (!plusActionExist && this.addRemoveColumn) {
      columns.push({ field: 'plusAction', width: 20, name: '+', show: true, order: maxOrder + 1 });
      return columns;
    } else {
      return columns;
    }
  }

  //Событие вызываемое при изменении ширины экрана
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.reloading = false
    //Функция вызываемая для придания ширины экрана
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.oSub.unsubscribe()
  }

  trackByFn(index: number): number {
    return index;
  }

  //Функции для фильтра по столбцам
  setupFilter(column: string) {
    this.dataSource.filterPredicate = (d: Contact, filter: string) => {
      const textToSearch = d[column] && d[column].toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }
  
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showContact(row: string) {
    console.log(row)
  }

}
