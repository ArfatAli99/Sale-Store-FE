import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectScopesListingComponent } from './project-scopes-listing.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ProjectScopesListingComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectScopesListingRoutingModule { }
