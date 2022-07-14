import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonserviceService } from '../../../commonservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {
  @ViewChild('imageElem') imageElem: ElementRef;
  blockId: number;
  fileName: string = 'Select file';
  cardTitle = "Add Block";
  submitBtnText:string = "Submit";
  addPageForm: FormGroup;

  logoUrl: any = "";
  baseImageUrl = environment.upload_url;
  fileToUpload;
  validImageTypes = ["image/png", 'image/jpeg', 'image/jpg'];
  pageState: number;
  formSubmitted: boolean = false;

 /**
   * Creates an instance.
   * input: @param commonservice
   * @param fb
   * @param router
   * @param toastr
   * @param route
   * created by : Biswajit
   */
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

 /**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by : Biswajit
   */
  ngOnInit() {
    this.generateForm();

    this.blockId = +this.route.snapshot.paramMap.get('id');
    this.pageState = history.state['page'] ? history.state['page'] : 1;

		if (this.blockId) {
      this.cardTitle = 'Edit Block';
      this.submitBtnText = 'Save Changes';
      this.fileName = 'Change file';
			this.getBlockDetails();
		}
  }
   /**
   * Generate the form
   * created by: priyanjali
   */
  generateForm() {
    this.addPageForm = this.fb.group({
      pageLogoUrl      : new FormControl('', [Validators.required]),
      type             : new FormControl('', [Validators.required]),
      title            : new FormControl('', [Validators.required]),
      description      : new FormControl('', [Validators.required]),
      titleArabic      : new FormControl('', [Validators.required]),
      descriptionArabic: new FormControl('', [Validators.required]),
      link             : new FormControl(''),
      isActive         : new FormControl(1)
    });
  }

  /**
   * Get partner logo details
   * method: GET
   * output: resp
   * created by: Biswajit
   */
  getBlockDetails() {
    let urlData = {
      url: `admin/cms-grid-details?id=${this.blockId}`
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];

        if (response.image) {
          this.logoUrl = response.image;
        }

        this.addPageForm.patchValue({
          pageLogoUrl      : response.image,
          type             : response.type,
          title            : response.title,
          description      : response.description,
          titleArabic      : response.title_arabic,
          descriptionArabic: response.description_arabic,
          link             : response.link,
          isActive         : response.is_active
        });
      }
    });
  }

  /**
   * Set the logo file
   * @param files Files
   */
  postMethod(files: FileList) {
    let file = files.item(0);

    if (!file) {
      return;
    }

    if (! this.validImageTypes.includes(file.type)) {
      this.commonService.commonToastrMessage("Please upload valid image.", 'error', 'Error');
      return;
    }

    this.fileToUpload = file;
    this.fileName = this.fileToUpload.name;

    // Upload Image
    let urlData = {
      url: 'admin/upload-image-our-story'
    };
    let formData = new FormData();
    formData.append("upload", this.fileToUpload);

    this.commonService.httpCallPostformdata(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.logoUrl = resp.url;
        this.fileName = 'Select image';
        this.addPageForm.patchValue({
          pageLogoUrl: resp.url
        });
      } else {
        this.commonService.commonToastrMessage(resp.msg, 'error', 'Error');
      }
    });
  }

  /**
   * Upload the logo
   */
  handlePage() {
    this.formSubmitted = true;

    // if (! this.fileToUpload && ! this.blockId) {
    //   this.commonService.commonToastrMessage("Please select an image.", 'error', 'Error');
    //   return;
    // }

    if (this.addPageForm.valid) {
      let url = 'admin/cms-grid';
      let method_name = 'httpCallPost';
      let formValues = this.addPageForm.value;

      let formData = <any> {
        type              : formValues.type,
        title             : formValues.title,
        description       : formValues.description,
        title_arabic      : formValues.titleArabic,
        description_arabic: formValues.descriptionArabic,
        link              : formValues.link,
        is_active         : formValues.isActive,
        image             : formValues.pageLogoUrl,
      };

      if (this.blockId) {
        url = 'admin/cms-grid';
        method_name = 'httpCallPut';
        formData.id = this.blockId;
      }

      let urldata = {
        url: url
      }

      this.commonService[method_name](urldata, formData)
      .subscribe(data => {
        if (data.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(data.msg, 'success', 'Success');
          this.goBack();
        } else if (data.status === environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(data.msg, 'success', 'Success');
          this.goBack();
        } else {
          this.toastr.error(data.msg, 'Error', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
          });
        }
      });
    } else {
      if (! this.fileToUpload && ! this.blockId) {
        this.commonService.commonToastrMessage("Please fix form values.", 'error', 'Error');
      }
    }
  }

  /**
  * Go back to previous page
  */
  goBack(): void {
    this.router.navigateByUrl('/grid-list', { state: { pageState: this.pageState } });
  }

  /**
   * Get form controls
   */
  get formControls() {
    return this.addPageForm.controls;
  }

}
