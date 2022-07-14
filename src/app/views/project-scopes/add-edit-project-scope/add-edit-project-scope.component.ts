import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonserviceService } from '../../../commonservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-edit-project-scope',
  templateUrl: './add-edit-project-scope.component.html',
  styleUrls: ['./add-edit-project-scope.component.scss']
})
export class AddEditProjectScopeComponent implements OnInit {

  scopeId: number;
  cardTitle: string = 'Add Default Project Scope';
  submitBtnText: string = 'Submit';
  projectScopeForm: FormGroup;
  pageState: number;
  projectScopeFormSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.scopeId = +this.route.snapshot.paramMap.get('id');
    this.pageState = history.state['page'] ? history.state['page'] : 1;
    this.generateForm();

		if (this.scopeId) {
      this.cardTitle = 'Edit Default Project Scope';
      this.submitBtnText = "Save Changes";
			this.getScopeDetails();
		}
  }

  /**
   * Generate the project scope form
   */
  generateForm() {
    this.projectScopeForm = this.fb.group({
      type: new FormControl(1),
      scopeType: new FormControl(0),
      groupName: new FormControl('supply_and_install_by_contractor'),
      scopeDetails: new FormControl('', [Validators.required]),
      scopeDetailsArabic: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Return project form controls
   */
  get projectScopeFormControls() {
    return this.projectScopeForm.controls;
  }

  /**
   * Get scope details by id
   */
  getScopeDetails() {
    let urlData = {
      url: `admin/project-scope-details?id=${this.scopeId}`
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];

        if (response) {
          this.projectScopeForm.patchValue({
            type: response.type,
            scopeType: response.scope_type,
            groupName: response.group_name,
            scopeDetails: response.scope_description,
            scopeDetailsArabic: response.scope_description_arabic,
          });

          // this.projectScopeForm.controls['type'].disable();
          // this.projectScopeForm.controls['scopeType'].disable();
          // this.projectScopeForm.controls['groupName'].disable();
        }
      }
    });
  }

  /**
   * Submit the project scope form
   */
  submitForm() {
    this.projectScopeFormSubmitted = true;

    if (this.projectScopeForm.valid) {
      let url = 'admin/project-scope';
      let method_name = 'httpCallPostformdata';
      let formValues = this.projectScopeForm.getRawValue();

      let formData = <any> {
        type             : formValues.type,
        scope_type       : formValues.scopeType,
        group_name       : formValues.groupName,
        scope_description: formValues.scopeDetails,
        scope_description_arabic: formValues.scopeDetailsArabic,
      };

      if (this.scopeId) {
        url = 'admin/project-scope-details';
        method_name = 'httpCallPutformdata';
        formData.id = this.scopeId;
      }

      let urldata = {
        url: url
      }

      this.commonService[method_name](urldata, formData)
      .subscribe(data => {
        if (data.status == environment.HTTP_STATUS_CREATED || data.status == environment.HTTP_STATUS_OK) {
          Swal.fire({
            title: data.message,
            type: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              // if (url = 'cmsadd') {
              //   this.router.navigate(['project-scopes']);
              // }
              // this.router.navigate(['project-scopes']);
              this.goBack();
            }
          })
        } else {
          this.commonService.commonToastrMessage(data.message, 'error', 'Error');
        }
      });
    } else {
      for (let inner in this.projectScopeForm.controls) {
        this.projectScopeForm.get(inner).markAsTouched();
        this.projectScopeForm.get(inner).updateValueAndValidity();
      }
    }
  }

  /**
  * Go back to previous page
  */
  goBack(): void {
    this.router.navigateByUrl('/project-scopes', { state: { pageState: this.pageState } });
  }

}
