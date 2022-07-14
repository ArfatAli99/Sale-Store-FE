import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectListingRoutingModule } from './project-listing-routing.module';
import { ProjectListingComponent } from './project-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NotificationService } from '../../../_services/notification.service';

@NgModule({
  declarations: [
    ProjectListingComponent,
  ],
  imports: [
    CommonModule,
    ProjectListingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    NotificationService
  ]
})
export class ProjectListingModule { }
