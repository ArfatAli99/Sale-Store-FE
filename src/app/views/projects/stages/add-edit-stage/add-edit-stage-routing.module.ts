import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditStageComponent } from './add-edit-stage.component';
import { AuthGuard } from '../../../../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AddEditStageComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditStageRoutingModule { }
