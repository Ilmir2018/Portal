import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './classes/auth.guard';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
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
  {path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
    
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
