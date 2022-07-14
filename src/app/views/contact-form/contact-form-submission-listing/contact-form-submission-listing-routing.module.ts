import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactFormSubmissionListingComponent } from './contact-form-submission-listing.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: ContactFormSubmissionListingComponent,
    canActivate: [AuthGuard]
  }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactFormSubmissionListingRoutingModule { }
