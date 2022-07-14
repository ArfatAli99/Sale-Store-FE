import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditCustomProjectScopeComponent } from './add-edit-custom-project-scope.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AddEditCustomProjectScopeComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditCustomProjectScopeRoutingModule { }
