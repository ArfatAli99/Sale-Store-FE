import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChangePasswordComponent} from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ChangePasswordRoutingModule,
  ]
})
export class ChangePasswordModule { }
