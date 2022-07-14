import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { AddEditStageRoutingModule } from './add-edit-stage-routing.module';
import { AddEditStageComponent } from './add-edit-stage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEditStageComponent],
  imports: [
    CommonModule,
    AddEditStageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class AddEditStageModule { }
