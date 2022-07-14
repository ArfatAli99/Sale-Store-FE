import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultantInvitationRoutingModule } from './consultant-invitation-routing.module';
import { ConsultantInvitationComponent } from './consultant-invitation.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConsultantInvitationComponent],
  imports: [
    CommonModule,
    ConsultantInvitationRoutingModule,
    FormsModule,
  ]
})
export class ConsultantInvitationModule { }
