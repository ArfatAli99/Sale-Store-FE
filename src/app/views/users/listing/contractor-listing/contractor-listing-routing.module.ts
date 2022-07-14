import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractorListingComponent } from './contractor-listing.component';

const routes: Routes = [
  {
    component: ContractorListingComponent,
    path: ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractorListingRoutingModule { }
