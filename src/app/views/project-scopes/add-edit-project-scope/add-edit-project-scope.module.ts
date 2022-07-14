import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditProjectScopeRoutingModule } from './add-edit-project-scope-routing.module';
import { AddEditProjectScopeComponent } from './add-edit-project-scope.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEditProjectScopeComponent],
  imports: [
    CommonModule,
    AddEditProjectScopeRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddEditProjectScopeModule { }
