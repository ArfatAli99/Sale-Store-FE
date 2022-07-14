import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactFormSubmissionDetailsComponent } from './contact-form-submission-details.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: ContactFormSubmissionDetailsComponent,
    canActivate: [AuthGuard]
  }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactFormSubmissionDetailsRoutingModule { }
