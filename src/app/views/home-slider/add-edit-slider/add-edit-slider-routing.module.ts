import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditSliderComponent } from './add-edit-slider.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: AddEditSliderComponent,
    canActivate: [AuthGuard]
  }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditSliderRoutingModule { }
