import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProjectsRoutingModule } from './user-projects-routing.module';
import { UserProjectsComponent } from './user-projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [UserProjectsComponent],
  imports: [
    CommonModule,
    UserProjectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserProjectsModule { }
