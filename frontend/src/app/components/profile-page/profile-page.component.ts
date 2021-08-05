import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ContactsService } from 'src/app/services/contacts.service';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {

  public gridApi;
  public gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public rowData: any;

  constructor(private http: HttpClient, private service: ContactsService) {
    this.columnDefs = [
      {
        // headerName: 'Athlete Details',
        children: [
          {
            headerName: 'name',
            field: 'name',
            width: 180,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'firm',
            field: 'firm',
            width: 90,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'email',
            field: 'email',
            width: 140,
            filter: 'agTextColumnFilter',
          },
          {
            headerName: 'phone',
            field: 'phone',
            width: 140,
            filter: 'none',
          },
        ],
      },
    ];
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.service.getContacts().subscribe(contacts => {
      this.rowData = contacts
    })
  }

}
