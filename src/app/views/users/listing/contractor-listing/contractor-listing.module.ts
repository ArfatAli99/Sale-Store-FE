import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractorListingRoutingModule } from './contractor-listing-routing.module';
import { ContractorListingComponent } from './contractor-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ContractorListingComponent],
  imports: [
    CommonModule,
    ContractorListingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ContractorListingModule { }
