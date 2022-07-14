import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import {TaskTemplateDetailsComponent} from './task-template-details.component';

import { TaskTemplateDetailsRoutingModule } from './task-template-details-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [TaskTemplateDetailsComponent],
  imports: [
    CommonModule,
    TaskTemplateDetailsRoutingModule, 
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TaskTemplateDetailsModule { }
