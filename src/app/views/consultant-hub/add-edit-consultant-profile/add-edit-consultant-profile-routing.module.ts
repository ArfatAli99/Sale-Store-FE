import { AuthGuard } from './../../../auth.guard';
import { AddEditConsultantProfileComponent } from './add-edit-consultant-profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AddEditConsultantProfileComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditConsultantProfileRoutingModule { }
