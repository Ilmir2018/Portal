import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FilterService } from 'src/app/services/filter.service';


export enum array {
  one,
  two,
  three
}

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {

  links = [
    {
      url: "/settings", name: "Настройки", menu: [
        { value: 'Пользователи', key: '', url: "/contacts" },
      ]
    },
    { url: "/profile", name: "Профиль" },
    { url: "/menu", name: "Mеню" }
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
