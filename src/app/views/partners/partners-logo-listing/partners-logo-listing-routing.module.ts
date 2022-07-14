import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnersLogoListingComponent } from './partners-logo-listing.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: PartnersLogoListingComponent,
    canActivate: [AuthGuard]
  }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnersLogoListingRoutingModule { }
