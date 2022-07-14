import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteSettingsDetailRoutingModule } from './site-settings-detail-routing.module';
import { SiteSettingsDetailComponent } from './site-settings-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SiteSettingsDetailComponent],
  imports: [
    CommonModule,
    SiteSettingsDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SiteSettingsDetailModule { }
