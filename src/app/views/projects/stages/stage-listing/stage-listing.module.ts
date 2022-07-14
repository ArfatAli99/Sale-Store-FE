import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StageListingRoutingModule } from './stage-listing-routing.module';
import { StageListingComponent } from './stage-listing.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [StageListingComponent],
  imports: [
    CommonModule,
    StageListingRoutingModule,
    SharedModule
  ]
})
export class StageListingModule { }
