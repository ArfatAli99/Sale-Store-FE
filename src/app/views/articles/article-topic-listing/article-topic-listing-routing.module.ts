import { AuthGuard } from './../../../auth.guard';
import { ArticleTopicListingComponent } from './article-topic-listing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path: '',
    component: ArticleTopicListingComponent,
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleTopicListingRoutingModule { }
