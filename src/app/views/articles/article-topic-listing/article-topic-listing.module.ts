import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleTopicListingRoutingModule } from './article-topic-listing-routing.module';
import { ArticleTopicListingComponent } from './article-topic-listing.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ArticleTopicListingComponent,    
  ],
  imports: [
    CommonModule,
    ArticleTopicListingRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class ArticleTopicListingModule { }
