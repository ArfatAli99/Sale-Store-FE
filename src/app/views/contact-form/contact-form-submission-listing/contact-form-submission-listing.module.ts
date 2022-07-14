import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactFormSubmissionListingRoutingModule } from './contact-form-submission-listing-routing.module';
import { ContactFormSubmissionListingComponent } from './contact-form-submission-listing.component';

@NgModule({
  declarations: [ContactFormSubmissionListingComponent],
  imports: [
    CommonModule,
    ContactFormSubmissionListingRoutingModule
  ]
})
export class ContactFormSubmissionListingModule { }
