import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeSliderListingRoutingModule } from './home-slider-listing-routing.module';
import { HomeSliderListingComponent } from './home-slider-listing.component';

@NgModule({
  declarations: [HomeSliderListingComponent],
  imports: [
    CommonModule,
    HomeSliderListingRoutingModule
  ]
})
export class HomeSliderListingModule { }
