import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageListingRoutingModule } from './language-listing-routing.module';
import { LanguageListingComponent } from './language-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [LanguageListingComponent],
  imports: [
    CommonModule,
    LanguageListingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LanguageListingModule { }
