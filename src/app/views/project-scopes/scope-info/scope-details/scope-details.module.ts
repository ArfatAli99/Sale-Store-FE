import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScopeDetailsRoutingModule } from './scope-details-routing.module';
import { ScopeDetailsComponent } from './scope-details.component';
import {  ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ScopeDetailsComponent],
  imports: [
    CommonModule,
    ScopeDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class ScopeDetailsModule { }
