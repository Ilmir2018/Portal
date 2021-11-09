import { Component, Input, OnInit } from '@angular/core';
import { NavItemNew } from 'src/app/interfaces';
import { MenuService } from 'src/app/services/menu.service';


@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.scss']
})
export class MenuUpdateComponent implements OnInit {

  @Input() public menuItems: NavItemNew;

  constructor(private service: MenuService) { }

  ngOnInit(): void {}

  settings(item) {
    this.service.settingsMenu = true
    this.service.settingsItem = item
  }


}
