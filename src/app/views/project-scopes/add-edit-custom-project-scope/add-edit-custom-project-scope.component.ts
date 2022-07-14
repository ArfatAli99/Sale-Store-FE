import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonserviceService } from '../../../commonservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-custom-project-scope',
  templateUrl: './add-edit-custom-project-scope.component.html',
  styleUrls: ['./add-edit-custom-project-scope.component.scss']
})
export class AddEditCustomProjectScopeComponent implements OnInit {

  scopeId: number;
  cardTitle: string = 'Add Custom Project Scope';
  submitBtnText: string = 'Submit';
  projectScopeForm: FormGroup;
  pageState: number;
  projectScopeFormSubmitted: boolean = false;
  isQuestionOptionSelected: boolean = false;

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
      this.cardTitle = 'Edit Custom Project Scope';
      this.submitBtnText = "Save Changes";
			this.getScopeDetails();
		}
  }

  /**
   * Generate the project scope form
   */
  generateForm() {
    this.projectScopeForm = this.fb.group({
      type: new FormControl(2),
      scopeType: new FormControl(1),
      groupName: new FormControl('custom_scope'),
      question: new FormControl(''),
      questionInArabic: new FormControl(''),
      scopeDetails: new FormControl('', [Validators.required]),
      scopeDetailsArabic: new FormControl('', [Validators.required]),
    });

    this.onChanges();
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
            type              : response.type,
            scopeType         : response.scope_type,
            groupName         : response.group_name,
            question          : response.project_question_in_english,
            questionInArabic  : response.project_question_in_arabic,
            scopeDetails      : response.scope_description,
            scopeDetailsArabic: response.scope_description_arabic,
          });

          this.isQuestionOptionSelected = response.scope_type == 1 ? false : true;

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
        type                       : formValues.type,
        scope_type                 : formValues.scopeType,
        group_name                 : formValues.groupName,
        project_question_in_english: formValues.question,
        project_question_in_arabic : formValues.questionInArabic,
        scope_description          : formValues.scopeDetails,
        scope_description_arabic   : formValues.scopeDetailsArabic,
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

  /**
   * Detect form fields changes
   */
  onChanges(): void {
    this.projectScopeForm.get('scopeType').valueChanges.subscribe(val => {
      if (val == 2) {
        this.isQuestionOptionSelected = true;

        this.projectScopeForm.controls['question'].setValidators([Validators.required]);
        this.projectScopeForm.controls['question'].updateValueAndValidity();

        this.projectScopeForm.controls['questionInArabic'].setValidators([Validators.required]);
        this.projectScopeForm.controls['questionInArabic'].updateValueAndValidity();

      } else {
        this.isQuestionOptionSelected = false;

        this.projectScopeForm.controls['question'].setValidators([]);
        this.projectScopeForm.controls['question'].updateValueAndValidity();

        this.projectScopeForm.controls['questionInArabic'].setValidators([]);
        this.projectScopeForm.controls['questionInArabic'].updateValueAndValidity();
      }
    });
  }

}
