import { Component } from '@angular/core';
import { GridColumnDefinition } from '../../interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {

  columns: GridColumnDefinition[] = [
    { field: 'name', width: 40, name: 'name', show: true, order: 1 },
    { field: 'firm', width: 80, name: 'firm', show: true, order: 2 },
    { field: 'email', width: 50, name: 'email', show: true, order: 3 },
    { field: 'phone', width: 40, name: 'phone', show: true, order: 4 },

  ];
  
  dataSource: MatTableDataSource<any>;

  constructor(private service: ContactsService) {

    this.service.changedColumns = this.columns
    //Из кэша получаем сохранённые настройки по ширине столбцов
    if(localStorage.getItem('widthChange') !== undefined) {
      this.columns = JSON.parse(localStorage.getItem('widthChange'))
    }
  }

}
