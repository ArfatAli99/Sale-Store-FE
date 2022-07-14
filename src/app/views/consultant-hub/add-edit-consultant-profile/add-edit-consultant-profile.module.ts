import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgxDropzoneModule } from 'ngx-dropzone';

import { AddEditConsultantProfileRoutingModule } from './add-edit-consultant-profile-routing.module';
import { AddEditConsultantProfileComponent } from './add-edit-consultant-profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [AddEditConsultantProfileComponent],
  imports: [
    CommonModule,
    AddEditConsultantProfileRoutingModule,
    MaterialModule,
    // NgxDropzoneModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AddEditConsultantProfileModule { }
