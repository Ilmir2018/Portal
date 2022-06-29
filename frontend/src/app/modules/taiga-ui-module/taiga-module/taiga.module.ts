import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPageComponent } from 'src/app/components/template-page/edit-page/edit-page.component';
import { HttpClientModule } from '@angular/common/http';
import { TuiLetModule } from '@taiga-ui/cdk';

@NgModule({
  entryComponents: [
    
  ],
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    TuiLetModule
  ],
  exports: []
})
export class TaigaModule { }
