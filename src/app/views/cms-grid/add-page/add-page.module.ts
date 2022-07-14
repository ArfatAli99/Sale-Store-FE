import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPageRoutingModule } from './add-page-routing.module';
import { AddPageComponent } from './add-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddPageComponent],
  imports: [
    CommonModule,
    AddPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddPageModule { }
