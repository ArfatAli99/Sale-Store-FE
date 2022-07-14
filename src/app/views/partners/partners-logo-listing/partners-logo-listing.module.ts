import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnersLogoListingRoutingModule } from './partners-logo-listing-routing.module';
import { PartnersLogoListingComponent } from './partners-logo-listing.component';

@NgModule({
  declarations: [PartnersLogoListingComponent],
  imports: [
    CommonModule,
    PartnersLogoListingRoutingModule
  ]
})
export class PartnersLogoListingModule { }
