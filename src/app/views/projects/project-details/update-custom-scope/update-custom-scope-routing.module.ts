import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../auth.guard';
import { UpdateCustomScopeComponent } from './update-custom-scope.component';

const routes: Routes = [
  {
    path: "",
    component: UpdateCustomScopeComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateCustomScopeRoutingModule { }
