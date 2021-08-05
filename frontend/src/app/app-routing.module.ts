import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './classes/auth.guard';
import { RoleGuard } from './classes/role.guard';
import { ContactPageComponent } from './components/contacts-page/contact-page/contact-page.component';

import { ContactsPageComponent } from './components/contacts-page/contacts-page.component';
import { NewContactComponent } from './components/contacts-page/new-contact/new-contact.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
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
      {path: 'contacts', component: ContactsPageComponent},
      {path: 'profile', component: ProfilePageComponent},
      {path: 'contacts/new', component: NewContactComponent, canActivate: [RoleGuard]},
      {path: 'contacts/:id', component: ContactPageComponent, canActivate: [RoleGuard]},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
