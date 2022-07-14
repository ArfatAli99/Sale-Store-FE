import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientListingRoutingModule } from './client-listing-routing.module';
import { ClientListingComponent } from './client-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ClientListingComponent],
  imports: [
    CommonModule,
    ClientListingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ClientListingModule { }
