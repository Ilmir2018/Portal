import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './classes/auth.guard';
import { RoleGuard } from './classes/role.guard';
import { ContactPageComponent } from './components/contacts-page/contact-page/contact-page.component';

import { ContactsPageComponent } from './components/contacts-page/contacts-page.component';
import { NewContactComponent } from './components/contacts-page/new-contact/new-contact.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MenuTemplateComponent } from './components/menu-template/menu-template.component';
import { MenuTemplate2Component } from './components/menu-template2/menu-template2.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: 'settings', component: SettingsPageComponent},
      {path: 'menu', component: MenuTemplate2Component},
      {path: 'profile', component: ProfilePageComponent},
      {path: 'contacts', component: ContactsPageComponent},
      {path: 'contacts/new', component: NewContactComponent, canActivate: [RoleGuard]},
      {path: 'contacts/:id', component: ContactPageComponent, canActivate: [RoleGuard]},
    ]
  },
];

// routes.forEach((item, idx) => {
//   item.children[2].path = "sdgdsgsdgdsg"
//   console.log(item)
// })

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
