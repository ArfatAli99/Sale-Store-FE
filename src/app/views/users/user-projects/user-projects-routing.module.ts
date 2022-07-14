import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProjectsComponent } from './user-projects.component';

const routes: Routes = [
  {
    component: UserProjectsComponent,
    path: ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProjectsRoutingModule { }
