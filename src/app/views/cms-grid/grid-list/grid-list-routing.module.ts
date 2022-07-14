import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridListComponent } from './grid-list.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: GridListComponent,
    canActivate: [AuthGuard]
  }    
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GridListRoutingModule { }
