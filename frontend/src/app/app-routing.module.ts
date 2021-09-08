import { NgModule } from '@angular/core';
import { PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './classes/auth.guard';
import { RoleGuard } from './classes/role.guard';
import { ContactPageComponent } from './components/contacts-page/contact-page/contact-page.component';

import { ContactsPageComponent } from './components/contacts-page/contacts-page.component';
import { NewContactComponent } from './components/contacts-page/new-contact/new-contact.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';
import { ContactsService } from './services/contacts.service';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent }
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'settings', component: SettingsPageComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'contacts', component: ContactsPageComponent },
      { path: 'contacts/new', component: NewContactComponent, canActivate: [RoleGuard] },
      { path: 'contacts/:id', component: ContactPageComponent, canActivate: [RoleGuard] },
      { path: '**', component: SettingsPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})


export class AppRoutingModule {
  private routes = [];

  constructor(private router: Router, private service: ContactsService) {
    // this.router.config.unshift(
    //   { path: 'test', component: SettingsPageComponent },
    // );
    // setTimeout(() => {
    //   this.router.resetConfig([
    //     { path: 'wdgfweg', component: SettingsPageComponent },
    //     {
    //       path: '', component: AuthLayoutComponent, children: [
    //         { path: '', redirectTo: '/login', pathMatch: 'full' },
    //         { path: 'login', component: LoginPageComponent },
    //         { path: 'register', component: RegisterPageComponent }
    //       ]
    //     },
    //     {
    //       path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
    //         { path: 'settings', component: SettingsPageComponent },
    //         { path: 'menu', component: MenuTemplate2Component },
    //         { path: 'profile', component: ProfilePageComponent },
    //         { path: 'contacts', component: ContactsPageComponent },
    //         { path: 'contacts/new', component: NewContactComponent, canActivate: [RoleGuard] },
    //         { path: 'contacts/:id', component: ContactPageComponent, canActivate: [RoleGuard] },
    //       ]
    //     },
    //   ]);
    //   console.log(this.router.config)
    // }, 1000)
    // setTimeout(() => {
    //   service.getContacts().subscribe(contacts => {
    //     this.recursionRoutes(contacts.menu);

    //     this.router.config.forEach((item) => {
    //       if (item.canActivate) {
    //         this.routes.forEach((route) => {
    //           this.router.config.push({ path: route, component: SettingsPageComponent })
    //         })
    //       }
    //       this.router.resetConfig(this.router.config)
    //     })
    //     console.log(this.router.config)

    //   })
    // }, 1000)
    // console.log(this.router.config)
  }

  recursionRoutes(arr: any) {
    arr.forEach((item) => {
      this.routes.push(item.url)
      this.recursionRoutes(item.subtitle)
    })
  }
}

