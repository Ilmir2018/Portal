import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.scss']
})

export class TemplatePageComponent implements OnInit {

  private itemSubscription: Subscription;
  item: number;
  action: boolean = true

  constructor(private route: ActivatedRoute) {
    this.itemSubscription = route.queryParams.subscribe(
      (queryParam: any) => {
        this.item = queryParam['item'];
      }
    );
  }

  ngOnInit(): void {
    if (this.item == 1 || this.item == undefined) {
      this.action = true
    } else {
      this.action = false
    }
  }

}