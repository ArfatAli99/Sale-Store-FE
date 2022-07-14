import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleAddEditComponent } from './article-add-edit.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: ArticleAddEditComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleAddEditRoutingModule { }
