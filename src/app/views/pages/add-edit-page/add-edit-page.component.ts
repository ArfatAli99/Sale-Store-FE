import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';

import { CommonserviceService } from '../../../commonservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

declare var CKEDITOR;

@Component({
  selector: 'app-add-edit-page',
  templateUrl: './add-edit-page.component.html',
  styleUrls: ['./add-edit-page.component.scss']
})
export class AddEditPageComponent implements OnInit {
  @ViewChild('myEditor') myEditor: any;
  createPageForm: FormGroup;
  config;

  // pageTitle: string = '';
  pageData;
  pageSlug: string;
  cardTitle: string = 'Add Page Block';
  submitBtnText: string = "Submit";

  constructor(
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
    // CKEDITOR.dtd.$removeEmpty['i'] = false;

    this.config = {
      filebrowserUploadUrl: environment.editor_upload_url,
      allowedContent: true,
      removeEmpty: false,
      removeFormatAttributes: '',
      removeFormatTags: '',
      extraPlugins: 'autogrow',
    };
  }

  ngOnInit() {
    this.generateForm();

    this.pageSlug = this.route.snapshot.paramMap.get('slug');

		if (this.pageSlug) {
      this.cardTitle = 'Edit Page Block';
      this.submitBtnText = "Save Changes";
      this.createPageForm.get('pageSlug').disable();
			this.getPageDetails();
		}
  }

  /**
   * Generate the CMS form
   * 
   * 
   */
  generateForm() {
    this.createPageForm = this.fb.group({
      pageTitle  : new FormControl('', [Validators.required]),
      pageTitleArabic: new FormControl('', [Validators.required]),

      pageSlug   : new FormControl('', [Validators.required]),
      pageDescription: new FormControl(),
      pageDescriptionArabic: new FormControl('', [Validators.required]),

      pageContent: new FormControl(),
      pageContentArabic: new FormControl('', [Validators.required]),

      signature: new FormControl(),
      signatureArabic: new FormControl('', [Validators.required]),

      isPublished: new FormControl()
    });

    // window.setTimeout(function(){
    //   CKEDITOR.dtd.$removeEmpty['i'] = 0;
    // },1000);
  }

  /**
   * Get CMS details
   */
  getPageDetails() {
    let urlData = {
      url: 'cms-page'
    };
    let sendData = {
      slug: this.pageSlug
    };

    this.commonService.httpCallPost(urlData, sendData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];
        this.pageData = response;

        this.createPageForm.patchValue({
          pageTitle       : response.name,
          pageTitleArabic : response.name_arabic,
          pageSlug        : response.slug,
          pageDescription : response.description,
          pageDescriptionArabic: response.description_arabic,
          pageContent     : response.data,
          pageContentArabic: response.data_arabic,
          signature       : response.signature,
          signatureArabic : response.signature_arabic,

          isPublished: response.is_published
        });
      } 
    });
  }
//data_arabic , description_arabic , name_arabic ,  signature_arabic

  /**
   * Create or update the CMS data
   * submit
   */
  createPage() {
    if (this.createPageForm.valid) {
      // console.log(this.createPageForm.value.pageContent);

      let url = 'admin/cmsadd';
      let method_name = 'httpCallPostformdata';
      let formValues = this.createPageForm.value;
      let formData = <any> {
        name        : formValues.pageTitle,
        name_arabic  : formValues.pageTitleArabic,
        slug        : formValues.pageSlug,
        description : formValues.pageDescription,
        description_arabic : formValues.pageDescriptionArabic,
        data        : formValues.pageContent,
        data_arabic  : formValues.pageContentArabic,
        signature   : formValues.signature,
        signature_arabic : formValues.signatureArabic,
        is_published : +formValues.isPublished
      };

      if (this.pageSlug) {
        url = 'admin/Cms';
        method_name = 'httpCallPutformdata';
        formData.id = this.pageData.id;
      }

      let urldata = {
        url: url
      }

      this.commonService[method_name](urldata, formData)
      .subscribe(data => {
        if (data.status == environment.HTTP_STATUS_OK) {
          Swal.fire({
            title: data.msg,
            type: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              // if (url = 'cmsadd') {
              //   this.router.navigate(['pages']);
              // }
            }
          })
        } else {
          this.toastr.error(data.msg, 'Error', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
          });
        }
      });
    } else {
      for (let inner in this.createPageForm.controls) {
        this.createPageForm.get(inner).markAsTouched();
        this.createPageForm.get(inner).updateValueAndValidity();
      }
    }
  }

  /**
   * Get CMS editor data
   */
  private getEditorContent() {
    let key = <any> Object.keys(CKEDITOR.instances);

    if (CKEDITOR && CKEDITOR.instances[key]) {
      return CKEDITOR.instances[key].getData();
    }

    return '';
  }

  /**
   * Dynamically add settings to ckeditor
   */
  onReady() {
    CKEDITOR.dtd.$removeEmpty.i = false;
  }

}
