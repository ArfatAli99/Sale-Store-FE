import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleTopicAddEditComponent } from './article-topic-add-edit.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: ArticleTopicAddEditComponent,
    canActivate: [AuthGuard]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleTopicAddEditRoutingModule { }
