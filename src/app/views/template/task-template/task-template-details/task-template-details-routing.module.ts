import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TaskTemplateDetailsComponent} from './task-template-details.component';

const routes: Routes = [{
   path: '',
   component: TaskTemplateDetailsComponent,
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskTemplateDetailsRoutingModule { }
