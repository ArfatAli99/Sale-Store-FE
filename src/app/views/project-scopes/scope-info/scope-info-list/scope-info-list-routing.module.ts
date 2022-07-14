import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScopeInfoListComponent } from './scope-info-list.component';
import { AuthGuard } from '../../../../auth.guard';

const routes: Routes = [
  {
    path: "",
    component: ScopeInfoListComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScopeInfoListRoutingModule { }
