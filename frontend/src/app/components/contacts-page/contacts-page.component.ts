import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})


export class ContactsPageComponent implements OnInit {

  dataSource: MatTableDataSource<any>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['roleDenied']) {
        MaterialService.toast('У вас нет прав доступа на эту операцию')
      }
    })
  }


}
