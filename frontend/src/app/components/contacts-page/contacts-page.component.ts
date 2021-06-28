import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact, Filter } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';
import { FilterService } from 'src/app/services/filter.service';

const STEP = 2

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})


export class ContactsPageComponent implements OnInit, OnDestroy {

  contacts: Contact[] = []
  filter: Filter = {}
  offset = 0
  limit = STEP
  oSub: Subscription
  loading: boolean = false
  reloading: boolean = false
  noMoreContacts: boolean = false

  constructor(private service: ContactsService, private filterService: FilterService) { }

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.service.getContacts(params).subscribe(contacts => {
      this.contacts = this.contacts.concat(contacts)
      this.noMoreContacts = contacts.length < STEP
      this.reloading = false
      this.loading = false
    })
  }

  ngOnDestroy() {
    this.oSub.unsubscribe()
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  applyFilter(filter: Filter) {
    this.contacts = []
    this.offset = 0
    this.loading = true
    this.filter = filter
    this.fetch()
  }

}
