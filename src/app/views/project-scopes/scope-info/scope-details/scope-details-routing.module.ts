import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScopeDetailsComponent } from './scope-details.component';
import { AuthGuard } from '../../../../auth.guard';

const routes: Routes = [
  {
    path: "",
    component: ScopeDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScopeDetailsRoutingModule { }
