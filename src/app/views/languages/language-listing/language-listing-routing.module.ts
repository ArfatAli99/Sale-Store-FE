import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanguageListingComponent } from './language-listing.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: LanguageListingComponent,
    canActivate: [AuthGuard]
  }   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguageListingRoutingModule { }
