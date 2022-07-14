import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScopeInfoListRoutingModule } from './scope-info-list-routing.module';
import { ScopeInfoListComponent } from './scope-info-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ScopeInfoListComponent],
  imports: [
    CommonModule,
    ScopeInfoListRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ScopeInfoListModule { }
