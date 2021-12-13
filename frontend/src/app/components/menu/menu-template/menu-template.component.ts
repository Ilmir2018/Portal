import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from 'src/app/interfaces';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu-template',
  templateUrl: './menu-template.component.html',
  styleUrls: ['./menu-template.component.scss']
})
export class MenuTemplateComponent implements OnInit, OnDestroy {


  @Input() public menuItems: NavItem;

  constructor(public service: MenuService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  toggle(e) {
    localStorage.setItem('element', e)
    let el = e.target
    let element = el.parentNode.childNodes[3].firstChild
    element.classList.toggle('active')
    el.classList.toggle('change-btn')
  }


}
