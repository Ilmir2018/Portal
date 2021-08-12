import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavItem } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-menu-template2',
  templateUrl: './menu-template2.component.html',
  styleUrls: ['./menu-template2.component.scss']
})
export class MenuTemplate2Component implements OnInit, OnDestroy {

  public navItems;
  oSub: Subscription

  constructor(private service: ContactsService) { }

  ngOnInit(): void {
    //Перезагрузка страницы, потому что меню не открывается через раз, почему то????
    if (localStorage.getItem("reload") === "false") {
      localStorage.removeItem("reload");
    } else {
      localStorage.setItem("reload", "false");
      window.location = window.location;
    }
    // this.navItems = [
    //   {
    //     title: "Title1",
    //     url: "/url1",
    //     subtitle: [
    //       {
    //         title: "Title2",
    //         url: "/url2",
    //         subtitle: [
    //           {
    //             title: "Title3",
    //             url: "/url3",
    //             subtitle: null
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ];

    this.oSub = this.service.getContacts().subscribe(contacts => {
      this.navItems = contacts.menu
    })
  }


  ngOnDestroy(): void {
    this.oSub.unsubscribe()
  }

}
