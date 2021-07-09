import { AfterContentInit, AfterViewInit, Component, ContentChild, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Contact, Filter } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})


export class ContactsPageComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  displayedColumns: string[] = ['name', 'firm', 'email', 'phone']
  filters: string[] = ['name', 'firm', 'email']
  filter: Filter = {}
  oSub: Subscription
  loading: boolean = false
  reloading: boolean = false
  noMoreContacts: boolean = false
  dataSource: MatTableDataSource<Contact>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private service: ContactsService, private filterService: FilterService) {
    this.fetch()
   }

  ngOnInit(): void {
    this.reloading = true
  }

  ngAfterViewInit() {
    this.fetch()
  }

  ngAfterContentInit() {
  }


  private fetch() {
    this.oSub = this.service.getContacts().subscribe(contacts => {
      this.dataSource = new MatTableDataSource(contacts)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.reloading = false
      this.loading = false
    })
  }

  ngOnDestroy() {
    this.oSub.unsubscribe()
  }

  setupFilter(column: string) {
    this.dataSource.filterPredicate = (d: Contact, filter: string) => {
      const textToSearch = d[column] && d[column].toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }
  
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
