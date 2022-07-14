import { CKEditorModule } from 'ckeditor4-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleAddEditRoutingModule } from './article-add-edit-routing.module';
import { ArticleAddEditComponent } from './article-add-edit.component';

@NgModule({
  declarations: [ArticleAddEditComponent],
  imports: [
    CommonModule,
    ArticleAddEditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ]
})
export class ArticleAddEditModule { }
