import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})


export class ContactsPageComponent {
  
  dataSource: MatTableDataSource<any>;

  constructor() {
  }


}
