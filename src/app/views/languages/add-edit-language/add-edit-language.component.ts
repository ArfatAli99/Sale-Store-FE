import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-edit-language',
  templateUrl: './add-edit-language.component.html',
  styleUrls: ['./add-edit-language.component.scss']
})
export class AddEditLanguageComponent implements OnInit {

  languageId: number;
  cardTitle = "Add Language String";
  submitBtnText:string = "Submit";
  languageForm: FormGroup;
  submitted: boolean = false;
  pageState: number;

  languageGroups: any = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private router: Router
  ) {
    this.languageGroups = this.commonService.getLanguageGroups();
  }

  ngOnInit() {
    this.generateForm();

    this.languageId = +this.route.snapshot.paramMap.get('id');

		if (this.languageId) {
      this.cardTitle = 'Edit Language';
      this.submitBtnText = 'Save Changes';
      this.getLanguageDetails();
      this.languageForm.controls['groupName'].disable();
    }

    this.pageState = history.state['page'] ? history.state['page'] : 1;
  }

  /**
   * Generate language form
   */
  generateForm() {
    this.languageForm = this.fb.group({
      groupName  : new FormControl('', [Validators.required]),
      languageKey: new FormControl('', [Validators.required]),
      englishKey : new FormControl('', [Validators.required]),
      arabicKey  : new FormControl('', [Validators.required]),
      isActive   : new FormControl(1),
    });
  }

  /**
   * Get form controls
   */
  get formControls() {
    return this.languageForm.controls;
  }

  /**
   * Get Language details
   */
  getLanguageDetails() {
    let urlData = {
      url: 'admin/language-details?id=' + this.languageId
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];

        this.languageForm.patchValue({
          groupName  : response.group_name,
          languageKey: response.field_key,
          englishKey : response.english,
          arabicKey  : response.arabic,
          isActive   : response.is_active,
        });
      }
    });
  }

  /**
   * Add/Update language string
   */
  updateLanguage() {
    this.submitted = true;

    if (this.languageForm.valid) {
      let url = 'admin/language';
      let method_name = 'httpCallPost';
      let formValues = this.languageForm.value;

      let formData = <any> {
        field_key : formValues.languageKey,
        group_name: formValues.groupName,
        arabic    : formValues.arabicKey,
        english   : formValues.englishKey,
        is_active : +formValues.isActive,
      };

      if (this.languageId) {
        url = 'admin/language';
        method_name = 'httpCallPut';
        formData.id = this.languageId;
      }

      let urldata = {
        url: url
      }

      this.commonService[method_name](urldata, formData)
      .subscribe(data => {
        if (data.status === environment.HTTP_STATUS_OK || data.status === environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(data.message, 'success', 'Success');
          this.goBack();
        } else {
          this.commonService.commonToastrMessage(data.message, 'error', 'Error')
        }
      });
    }
  }

  /**
  * Go back to previous page
  */
  goBack(): void {
    this.router.navigateByUrl('/languages', { state: { pageState: this.pageState } });
  }

}
