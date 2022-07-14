import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChangePasswordComponent} from './change-password.component';
import { AuthGuard } from '../../auth.guard';
import { AuthService } from '../../auth.service';

const routes: Routes = [ { path: '', component: ChangePasswordComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePasswordRoutingModule { }
