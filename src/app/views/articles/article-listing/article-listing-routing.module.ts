import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleListingComponent } from './article-listing.component';
import { AuthGuard } from '../../../auth.guard';

const routes: Routes = [
  { 
    path: '',
    component: ArticleListingComponent,
    canActivate: [AuthGuard]
  }      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleListingRoutingModule { }
