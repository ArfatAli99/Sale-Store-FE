import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AddEditPageRoutingModule } from './add-edit-page-routing.module';
import { AddEditPageComponent } from './add-edit-page.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [AddEditPageComponent],
  imports: [
    CommonModule,
    AddEditPageRoutingModule,
    CKEditorModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class AddEditPageModule { }
