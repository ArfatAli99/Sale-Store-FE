import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteSettingsDetailComponent } from './site-settings-detail.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: SiteSettingsDetailComponent,
    canActivate: [AuthGuard]
  }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteSettingsDetailRoutingModule { }
