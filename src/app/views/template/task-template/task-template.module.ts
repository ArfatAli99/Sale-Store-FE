import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TaskTemplateComponent} from './task-template.component';
import { ModalModule } from 'ngx-bootstrap/modal';

import { TaskTemplateRoutingModule } from './task-template-routing.module';
@NgModule({
  declarations: [TaskTemplateComponent],
  imports: [
    CommonModule,
    TaskTemplateRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TaskTemplateModule { }
