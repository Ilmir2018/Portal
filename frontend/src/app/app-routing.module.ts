import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './classes/auth.guard';
import { PermissionsGuard } from './classes/permissions.guard';
import { RoleGuard } from './classes/role.guard';
import { ContactPageComponent } from './components/contacts-page/contact-page/contact-page.component';
import { ContactsEditComponent } from './components/contacts-page/contacts-edit/contacts-edit.component';

import { ContactsPageComponent } from './components/contacts-page/contacts-page.component';
import { NewContactComponent } from './components/contacts-page/new-contact/new-contact.component';
import { AppDataComponent } from './components/data-changes/app-data/app-data.component';
import { DataChangesComponent } from './components/data-changes/data-changes.component';
import { DataTypesComponent } from './components/data-changes/data-types/data-types.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { TriggersPageComponent } from './components/triggers-page/triggers-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';

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
      { path: 'menu', component: MenuComponent, canActivate: [PermissionsGuard] },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'contacts', component: ContactsPageComponent },
      {
        path: 'dannye', component: DataChangesComponent, canActivate: [RoleGuard], children: [
          { path: 'data', component: AppDataComponent },
          { path: 'types', component: DataTypesComponent }
        ]
      },
      { path: 'triggers', component: TriggersPageComponent, canActivate: [RoleGuard] },
      { path: 'contacts/new', component: NewContactComponent, canActivate: [RoleGuard] },
      { path: 'contacts/edit', component: ContactsEditComponent, canActivate: [RoleGuard] },
      { path: 'contacts/:id', component: ContactPageComponent, canActivate: [RoleGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }

