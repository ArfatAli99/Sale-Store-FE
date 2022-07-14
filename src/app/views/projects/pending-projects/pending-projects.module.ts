import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingProjectsRoutingModule } from './pending-projects-routing.module';
import { PendingProjectsComponent } from './pending-projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NotificationService } from '../../../_services/notification.service';

@NgModule({
  declarations: [PendingProjectsComponent],
  imports: [
    CommonModule,
    PendingProjectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    NotificationService
  ]
})
export class PendingProjectsModule { }
