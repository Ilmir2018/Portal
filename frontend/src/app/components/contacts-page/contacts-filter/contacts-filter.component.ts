import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Filter } from 'src/app/interfaces';

@Component({
  selector: 'app-contacts-filter',
  templateUrl: './contacts-filter.component.html',
  styleUrls: ['./contacts-filter.component.scss']
})
export class ContactsFilterComponent implements OnInit {

  @Output() onFilter = new EventEmitter<Filter>()

  name: string
  firm: string
  email: string
  phone: string

  isValid = true
  
  constructor() { }

  ngOnInit(): void {
    
  }

  filterChange() {
    const filter: Filter = {}

    if(this.name) {
      filter.name = this.name
    }
    
    if(this.firm) {
      filter.firm = this.firm
    }

    if(this.email) {
      filter.email = this.email
    }

    if(this.phone) {
      filter.phone = this.phone
    }

    this.onFilter.emit(filter)
  }

}
