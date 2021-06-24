import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contacts-filter',
  templateUrl: './contacts-filter.component.html',
  styleUrls: ['./contacts-filter.component.scss']
})
export class ContactsFilterComponent implements OnInit {

  @Input() tab_num: number
  @Input() name: string
  isValid = true
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
