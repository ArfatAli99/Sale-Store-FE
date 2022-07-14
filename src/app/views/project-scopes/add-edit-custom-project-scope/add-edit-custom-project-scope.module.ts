import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditCustomProjectScopeRoutingModule } from './add-edit-custom-project-scope-routing.module';
import { AddEditCustomProjectScopeComponent } from './add-edit-custom-project-scope.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEditCustomProjectScopeComponent],
  imports: [
    CommonModule,
    AddEditCustomProjectScopeRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddEditCustomProjectScopeModule { }
