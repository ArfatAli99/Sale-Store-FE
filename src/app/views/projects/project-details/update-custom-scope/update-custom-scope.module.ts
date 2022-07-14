import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateCustomScopeRoutingModule } from './update-custom-scope-routing.module';
import { UpdateCustomScopeComponent } from './update-custom-scope.component';

@NgModule({
  declarations: [UpdateCustomScopeComponent],
  imports: [
    CommonModule,
    UpdateCustomScopeRoutingModule
  ]
})
export class UpdateCustomScopeModule { }
