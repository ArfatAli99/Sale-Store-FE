import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileChangesRoutingModule } from './profile-changes-routing.module';
import { ProfileChangesComponent } from './profile-changes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material.module';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [ProfileChangesComponent],
  imports: [
    CommonModule,
    ProfileChangesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TextMaskModule
  ]
})
export class ProfileChangesModule { }
