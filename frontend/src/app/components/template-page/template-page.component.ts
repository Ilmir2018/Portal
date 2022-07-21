import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReadEditEnum } from 'src/app/enums/ReadEditEnum';

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.scss']
})

export class TemplatePageComponent implements OnInit {

  private itemSubscription: Subscription;
  readEditParametr: number;
  action: boolean = true

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.itemSubscription = this.route.queryParams.subscribe(
      (queryParam: any) => {
        this.readEditParametr = queryParam['item'];
      }
    );
  }

  get readValue(): ReadEditEnum {
    return ReadEditEnum.read
  }

  get editValue(): ReadEditEnum {
    return ReadEditEnum.edit
  }

}