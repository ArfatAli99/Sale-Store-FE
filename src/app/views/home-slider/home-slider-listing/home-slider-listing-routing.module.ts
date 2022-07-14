import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeSliderListingComponent } from './home-slider-listing.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: HomeSliderListingComponent,
    canActivate: [AuthGuard]
  }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeSliderListingRoutingModule { }
