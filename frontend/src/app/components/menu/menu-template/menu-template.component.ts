import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavItem } from 'src/app/interfaces';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-menu-template',
  templateUrl: './menu-template.component.html',
  styleUrls: ['./menu-template.component.scss']
})
export class MenuTemplateComponent implements OnInit, OnDestroy {


  @Input() public menuItems: NavItem;

  constructor() { }

  ngOnInit(): void {
    addEventListener("click", (e) => this.spoiler(e))
  }

  ngOnDestroy() {
    removeEventListener("click", (e) => this.spoiler(e));
  }

  settings(item: NavItem) {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  spoiler(e) {
    if (!e.target.matches('.dropbtn')) {

      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


}
