import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListingComponent } from './users-listing.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UsersListingComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersListingRoutingModule { }
