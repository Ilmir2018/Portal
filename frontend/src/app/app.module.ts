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
import { SearchPipe } from './classes/search.pipe';
import { MaterialModule } from './material/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ResizableDirective } from './classes/resizable.directive';
import { TestPageComponent } from './components/profile-page/test-page/test-page.component';
import { SplitSchedulePipe } from './classes/split-schedule.pipe';
import { ContactsTableComponent } from './components/contacts-page/contacts-table/contacts-table.component';
import { ContactPageComponent } from './components/contacts-page/contact-page/contact-page.component';

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
    SearchPipe,
    ResizableDirective,
    TestPageComponent,
    SplitSchedulePipe,
    ContactsTableComponent,
    ContactPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MaterialModule,
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
