import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TemplateDetailsComponent} from './template-details.component';

import { TemplateDetailsRoutingModule } from './template-details-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [TemplateDetailsComponent],
  imports: [
    CommonModule,
    TemplateDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TemplateDetailsModule { }
