import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleListingRoutingModule } from './article-listing-routing.module';
import { ArticleListingComponent } from './article-listing.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ArticleListingComponent],
  imports: [
    CommonModule,
    ArticleListingRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class ArticleListingModule { }
