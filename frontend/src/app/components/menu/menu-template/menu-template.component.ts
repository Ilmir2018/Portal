import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from 'src/app/interfaces';

@Component({
  selector: 'app-menu-template',
  templateUrl: './menu-template.component.html',
  styleUrls: ['./menu-template.component.scss']
})
export class MenuTemplateComponent implements OnInit, OnDestroy {


  @Input() public menuItems: NavItem;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  toggle(e) {
    let el = e.target
    let element = el.parentNode.childNodes[3].firstChild
    element.classList.toggle('active')
    el.classList.toggle('change-btn')
  }


}
