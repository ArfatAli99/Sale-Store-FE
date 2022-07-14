import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../../auth.guard';
import { PagesListingComponent } from './pages-listing.component';

const routes: Routes = [
  { 
    path: '',
    component: PagesListingComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesListingRoutingModule { }
