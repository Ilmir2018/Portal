import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { Filter } from 'src/app/interfaces';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-contacts-filter',
  templateUrl: './contacts-filter.component.html',
  styleUrls: ['./contacts-filter.component.scss']
})
export class ContactsFilterComponent implements OnInit, DoCheck {

  @Input() tab_num: number
  @Input() name: string
  isValid = true
  
  constructor(private service: FilterService) { }

  ngOnInit(): void {
    
  }

  ngDoCheck() {
    this.service.tab_num = this.tab_num
  }



}
