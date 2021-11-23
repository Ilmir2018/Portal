import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, public service: MenuService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.service.menuItems = []
    this.service.menuItemsOld = []
    this.service.getMenu()
    //Определяем права доступа на с траницы
    this.route.queryParams.subscribe((params: Params) => {
      if (params['roleDenied']) {
        MaterialService.toast('Вы не админ')
      } else if(params['permissionDenied']) {
        MaterialService.toast('У вас нет прав доступа на эту операцию')
      }
    })
  }
   

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout()
    this.router.navigate(['/login'])
  }

}
