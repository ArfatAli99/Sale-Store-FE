import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TemplateComponent} from './template.component';
import { ModalModule } from 'ngx-bootstrap/modal';

import { TemplateRoutingModule } from './template-routing.module';
@NgModule({
  declarations: [TemplateComponent],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TemplateModule { }
