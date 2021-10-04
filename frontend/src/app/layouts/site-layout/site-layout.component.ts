import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, public service: MenuService) { }

  ngOnInit(): void {
    this.service.menuItems = []
    this.service.menuItemsOld = []
    this.service.getMenu()
  }
   

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout()
    this.router.navigate(['/login'])
  }

}
