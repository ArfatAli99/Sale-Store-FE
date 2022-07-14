import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectScopesListingRoutingModule } from './project-scopes-listing-routing.module';
import { ProjectScopesListingComponent } from './project-scopes-listing.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProjectScopesListingComponent],
  imports: [
    CommonModule,
    ProjectScopesListingRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ProjectScopesListingModule { }
