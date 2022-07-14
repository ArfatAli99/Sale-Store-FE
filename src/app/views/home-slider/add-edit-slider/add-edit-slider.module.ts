import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditSliderRoutingModule } from './add-edit-slider-routing.module';
import { AddEditSliderComponent } from './add-edit-slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEditSliderComponent],
  imports: [
    CommonModule,
    AddEditSliderRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddEditSliderModule { }
