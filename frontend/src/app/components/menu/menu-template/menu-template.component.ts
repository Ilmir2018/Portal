import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from 'src/app/interfaces';

@Component({
  selector: 'app-menu-template',
  templateUrl: './menu-template.component.html',
  styleUrls: ['./menu-template.component.scss']
})
export class MenuTemplateComponent implements OnInit, OnDestroy {


  @Input() public navItems: NavItem;

  constructor() { }

  ngOnInit(): void {
    // addEventListener("click", (e) => this.spoiler(e))
  }

  ngOnDestroy() {
    // removeEventListener("click", (e) => this.spoiler(e));
  }

  // spoiler(e) {
  //   const target = e.target as Element;
  //   if (target.classList.contains("spoiler__btn")) {
  //     target.closest(".spoiler-wrap").classList.toggle("spoiler--open");
  //   }
  // }



}
