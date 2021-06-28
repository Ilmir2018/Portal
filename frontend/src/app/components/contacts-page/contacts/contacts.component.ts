import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/interfaces';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {


  @Input() contact: Contact

  constructor() { }

  ngOnInit(): void {
  }

}
