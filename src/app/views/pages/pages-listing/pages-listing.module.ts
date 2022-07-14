import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesListingRoutingModule } from './pages-listing-routing.module';
import { PagesListingComponent } from './pages-listing.component';

@NgModule({
  declarations: [PagesListingComponent],
  imports: [
    CommonModule,
    PagesListingRoutingModule
  ]
})
export class PagesListingModule { }
