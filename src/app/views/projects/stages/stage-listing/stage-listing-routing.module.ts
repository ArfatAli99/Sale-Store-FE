import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageListingComponent } from './stage-listing.component';
import { AuthGuard } from '../../../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: StageListingComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StageListingRoutingModule { }
