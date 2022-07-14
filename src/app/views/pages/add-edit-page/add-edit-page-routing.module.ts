import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { AddEditPageComponent } from './add-edit-page.component';

const routes: Routes = [
  {
    path: '',
    component: AddEditPageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditPageRoutingModule { }
