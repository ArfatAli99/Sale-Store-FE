import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientListingComponent } from './client-listing.component';

const routes: Routes = [
  {
    component: ClientListingComponent,
    path: ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientListingRoutingModule { }
