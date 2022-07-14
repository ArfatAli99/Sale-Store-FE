import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditProjectScopeComponent } from './add-edit-project-scope.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AddEditProjectScopeComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditProjectScopeRoutingModule { }
