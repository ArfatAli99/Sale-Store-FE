import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleTopicAddEditRoutingModule } from './article-topic-add-edit-routing.module';
import { ArticleTopicAddEditComponent } from './article-topic-add-edit.component';

@NgModule({
  declarations: [ArticleTopicAddEditComponent],
  imports: [
    CommonModule,
    ArticleTopicAddEditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ArticleTopicAddEditModule { }
