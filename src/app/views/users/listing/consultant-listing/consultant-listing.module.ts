import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultantListingRoutingModule } from './consultant-listing-routing.module';
import { ConsultantListingComponent } from './consultant-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConsultantListingComponent],
  imports: [
    CommonModule,
    ConsultantListingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConsultantListingModule { }
