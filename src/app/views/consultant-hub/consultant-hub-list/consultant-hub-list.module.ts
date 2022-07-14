import { InviteRequestDialogComponent } from './invite-request-dialog/invite-request-dialog.component';
import { MaterialModule } from './../../../material.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultantHubRoutingModule } from './consultant-hub-list-routing.module';
import { ConsultantHubComponent } from './consultant-hub-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AriticalRequestDialogComponent } from './aritical-request-dialog/aritical-request-dialog.component';

@NgModule({
  declarations: [ConsultantHubComponent, InviteRequestDialogComponent, AriticalRequestDialogComponent],
  imports: [
    CommonModule,
    ConsultantHubRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  entryComponents: [InviteRequestDialogComponent,AriticalRequestDialogComponent]
})
export class ConsultantHubListModule { }
