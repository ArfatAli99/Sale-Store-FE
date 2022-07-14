import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditLanguageRoutingModule } from './add-edit-language-routing.module';
import { AddEditLanguageComponent } from './add-edit-language.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEditLanguageComponent],
  imports: [
    CommonModule,
    AddEditLanguageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddEditLanguageModule { }
