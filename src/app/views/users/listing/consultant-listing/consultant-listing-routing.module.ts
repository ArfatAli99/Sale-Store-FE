import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultantListingComponent } from './consultant-listing.component';

const routes: Routes = [
  {
    component: ConsultantListingComponent,
    path: ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultantListingRoutingModule { }
