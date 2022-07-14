import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersListingRoutingModule } from './users-listing-routing.module';
import { UsersListingComponent } from './users-listing.component';

@NgModule({
  declarations: [UsersListingComponent],
  imports: [
    CommonModule,
    UsersListingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersListingModule { }
