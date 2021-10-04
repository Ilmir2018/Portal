import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './classes/token.interceptor';
import { ContactsPageComponent } from './components/contacts-page/contacts-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NewContactComponent } from './components/contacts-page/new-contact/new-contact.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SplitSchedulePipe } from './classes/split-schedule.pipe';
import { ContactsTableComponent } from './components/contacts-page/contacts-table/contacts-table.component';
import { ContactPageComponent } from './components/contacts-page/contact-page/contact-page.component';
import { MenuTemplateComponent } from './components/menu/menu-template/menu-template.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuUpdateComponent } from './components/menu/menu-update/menu-update.component';
import { TemplatePageComponent } from './components/template-page/template-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    ContactsPageComponent,
    SettingsPageComponent,
    ProfilePageComponent,
    LoaderComponent,
    NewContactComponent,
    SplitSchedulePipe,
    ContactsTableComponent,
    ContactPageComponent,
    MenuTemplateComponent,
    MenuComponent,
    MenuUpdateComponent,
    TemplatePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    MatPaginatorModule,
  ]
})
export class AppModule { }
