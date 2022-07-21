import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule,TuiGroupModule, TUI_SANITIZER } from "@taiga-ui/core";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { MaterialModule } from './modules/material/material.module';
import { SplitSchedulePipe } from './classes/split-schedule.pipe';
import { ContactsTableComponent } from './components/contacts-page/contacts-table/contacts-table.component';
import { ContactPageComponent } from './components/contacts-page/contact-page/contact-page.component';
import { MenuTemplateComponent } from './components/menu/menu-template/menu-template.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuUpdateComponent } from './components/menu/menu-update/menu-update.component';
import { TemplatePageComponent } from './components/template-page/template-page.component';
import { ModalWindowComponent } from './components/menu/modal-window/modal-window.component';
import { ContactsEditComponent } from './components/contacts-page/contacts-edit/contacts-edit.component';
import { SearchPipe } from './classes/search.pipe';
import { DragAndDropDirective, DragAndDropRootDirective } from './classes/drag-and-drop.directive';
import { DragAndDropService } from './services/drag-and-drop.service';
import { MenuUpdateItemComponent } from './components/menu/menu-update/menu-update-item/menu-update-item.component';
import { DataChangesComponent } from './components/data-changes/data-changes.component';
import { DataTypesComponent } from './components/data-changes/data-types/data-types.component';
import { AppDataComponent } from './components/data-changes/app-data/app-data.component';
import { TriggersPageComponent } from './components/triggers-page/triggers-page.component';
import { ReadPageComponent } from './components/template-page/read-page/read-page.component';
import { TaigaModule } from "./modules/taiga-ui-module/taiga-module/taiga.module";
import { CommonModule } from '@angular/common';
import { EditPageComponent } from "./components/template-page/edit-page/edit-page.component";
import { ChoiseTypeContainerModalComponent } from './components/template-page/edit-page/choise-type-container-modal/choise-type-container-modal.component';
import { TuiLetModule } from '@taiga-ui/cdk';
import { ChoiseContainerTypeComponent } from './components/template-page/edit-page/choise-container-type/choise-container-type.component';
import { OpenWidgetTypeElementComponent } from './components/template-page/edit-page/open-widget-type-element/open-widget-type-element.component';
import { ChoiseWidgetTypeComponent } from './components/template-page/edit-page/choise-widget-type/choise-widget-type.component';
import { WidgetTypesComponent } from './components/template-page/edit-page/widget-types/widget-types.component';
import { ChoiseContainerTypeReadPageComponent } from './components/template-page/read-page/choise-container-type-read-page/choise-container-type-read-page.component';
import { ChoiseWidgetTypeReadPageComponent } from './components/template-page/read-page/choise-widget-type-read-page/choise-widget-type-read-page.component';

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
    TemplatePageComponent,
    ModalWindowComponent,
    ContactsEditComponent,
    SearchPipe,
    DragAndDropDirective,
    DragAndDropRootDirective,
    MenuUpdateItemComponent,
    DataChangesComponent,
    DataTypesComponent,
    AppDataComponent,
    TriggersPageComponent,
    ReadPageComponent,
    EditPageComponent,
    ChoiseTypeContainerModalComponent,
    ChoiseContainerTypeComponent,
    OpenWidgetTypeElementComponent,
    ChoiseWidgetTypeComponent,
    WidgetTypesComponent,
    ChoiseContainerTypeReadPageComponent,
    ChoiseWidgetTypeReadPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    TaigaModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    CommonModule,
    TuiGroupModule,
    TuiLetModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
    DragAndDropService,
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
