import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactFormSubmissionDetailsRoutingModule } from './contact-form-submission-details-routing.module';
import { ContactFormSubmissionDetailsComponent } from './contact-form-submission-details.component';

@NgModule({
  declarations: [ContactFormSubmissionDetailsComponent],
  imports: [
    CommonModule,
    ContactFormSubmissionDetailsRoutingModule
  ]
})
export class ContactFormSubmissionDetailsModule { }
