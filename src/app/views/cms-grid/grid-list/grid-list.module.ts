import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridListRoutingModule } from './grid-list-routing.module';
import { GridListComponent } from './grid-list.component';

@NgModule({
  declarations: [GridListComponent],
  imports: [
    CommonModule,
    GridListRoutingModule
  ]
})
export class GridListModule { }
