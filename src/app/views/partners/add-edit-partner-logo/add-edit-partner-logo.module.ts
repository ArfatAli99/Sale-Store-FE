import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditPartnerLogoRoutingModule } from './add-edit-partner-logo-routing.module';
import { AddEditPartnerLogoComponent } from './add-edit-partner-logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEditPartnerLogoComponent],
  imports: [
    CommonModule,
    AddEditPartnerLogoRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddEditPartnerLogoModule { }
