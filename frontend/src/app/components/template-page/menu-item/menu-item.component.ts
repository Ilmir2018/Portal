import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NavItemNew } from 'src/app/interfaces';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }

}
