import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingProjectsComponent } from './pending-projects.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PendingProjectsComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingProjectsRoutingModule { }
