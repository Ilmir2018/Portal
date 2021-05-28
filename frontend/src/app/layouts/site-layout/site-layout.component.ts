import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {

  links = [
    {
      url: "/contacts", name: "Контакты", menu: [
        {value: 'Все сотрудники', key: ''},
        {value: 'КЭР', key: 'КЭР'},
        {value: 'УЭС', key: 'УЭС'},
        {value: 'КАРНО', key: 'КАРНО'},
        {value: 'АЙВИС', key: 'АЙВИС'}
      ]
    },
    { url: "/settings", name: "Настройки" },
    { url: "/profile", name: "Профиль" }
  ]

  constructor(private auth: AuthService, private router: Router, private filter: FilterService) { }

  ngOnInit(): void {
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout()
    this.router.navigate(['/login'])
  }

  submitFilter(item: any) {
    this.filter.filter = item.key;
  }

}
