import { CommonserviceService } from './../../../commonservice.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import HesGallery from 'hes-gallery';
import BigPicture from 'bigpicture';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-consultant-profile',
  templateUrl: './add-edit-consultant-profile.component.html',
  styleUrls: ['./add-edit-consultant-profile.component.scss']
})
export class AddEditConsultantProfileComponent implements OnInit {
  @ViewChild('companyLogoInput') companyLogoInput: ElementRef;
  @ViewChild('projectImageInput') projectImageInput: ElementRef;

  consultantId: number;
  consultantForm: FormGroup;
  services: FormArray;
  engineer: FormArray;
  refMail: any;
  companyLogo: any;
  cvPhoto: any;
  engineerProfilePhoto: any;
  engineerResources = [];
  previousProjectImages = [];
  companyLogoFile: any;
  baseImageUrl = environment.upload_url;
  pageState: number;
  removed_company_engineer_ids = [];
  validCVTypes = ['application/pdf'];
  validImageTypes = ["image/png", 'image/jpeg', 'image/jpg'];
  consultantFormSubmitted: boolean = false;
  removed_service_ids = [];

  /**
   * Creates an instance.
   * input: @param commonservice
   * @param snackBar
   * @param router
   * @param dialog
   * @param route
   * @param fb
   * @param toastr
   * created by : Biswajit
   */
  constructor(
    public dialog: MatDialog,
    private commonService: CommonserviceService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
     private route: ActivatedRoute,
     private toastr: ToastrService,
     private router: Router,
     ) {

    this.consultantForm = this.fb.group({
      company_name: ['', [Validators.required]],
      phone_num: ['', [Validators.required]],
      fb_link: [''],
      linkedin_link: [''],
      instagram_link: [''],
      website_link: [''],
      pinterest_link: [''],
      whatsapp_num: [''],
      company_profile: [''],
      services: this.fb.array([]),
      engineer: this.fb.array([])
    });


  }

  /**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by : Biswajit
   */
  ngOnInit() {
    this.consultantId = +this.route.snapshot.paramMap.get('id');

    this.getProfileData();
    this.pageState = history.state['page'] ? history.state['page'] : 1;

    // let container = document.getElementById("image-wrapper");
    // Promise.all(Array.from(container.getElementsByTagName("img")).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
    //   console.log('images finished loading');
    // });
  }

  ngAfterViewInit() {
    window.setTimeout(() => {
      HesGallery.init({
        wrapAround: true,
        disableScrolling: true,
        autoInit: false
      });
    }, 5000);
  }

 /**
   * create services
   * @param data
   * purpose: initialize
   * created by : Biswajit
   */
  createServices(data): FormGroup {
    if ( data ) {
      return this.fb.group({
        id: data.id,
        service_name: data.Service_name,
        service_desc: data.Service_description,
      });
    } else {
      return this.fb.group({
        service_name: ['', Validators.required],
        service_desc: [''],
      });
    }
  }

  /**
   * addServices
   * @param data
   * created by : Biswajit
   */
  addServices(data = null) {
    this.services = this.consultantForm.get('services') as FormArray;
    if (this.services.length > 11) {
      this.commonService.commonToastrMessage('Maximum 12 services can be added', 'error', 'Error');
      return;
    }
    this.services.push(this.createServices(data));
  }

  /**
   * remove Services
   * @param index
   * created by : Biswajit
   */
  removeServices(index) {
    if (index > 0) {
      let service_id = this.services.value[index].id;
      this.removed_service_ids.push({
        "id": service_id
      });
      this.services.removeAt(index);
    }
  }

  /**
   * create engineer
   * @param data
   * created by : Biswajit
   */
  createEngineer(data): FormGroup {
    if (data) {
      this.engineerResources.push(data.resources.filter(resource => resource.is_active === 1));
    } else {

      this.engineerResources.push([{
        id: 0,
        user_id: 0,
        resource_type: "",
        resource_url: "",
        resource_thumbnail: "",
        type: "",
      }, {
        id: 0,
        user_id: 0,
        resource_type: "",
        resource_url: "",
        resource_thumbnail: "",
        type: "",
      }]);
    }

    if (data) {
      return this.fb.group({
        id: data.id,
        engineer_name: data.name,
        engineer_type: data.type,
        fb_profile: data.facebook_profile,
        linkedin_profile: data.linkedIn_profile,
        instagram_profile: data.instagram_profile,
      });
    } else {
      return this.fb.group({
        engineer_name: ['', Validators.required],
        engineer_type: [''],
        fb_profile: [''],
        linkedin_profile: [''],
        instagram_profile: [''],
      });
    }
  }

  addEngineer(data = null) {
    this.engineer = this.consultantForm.get('engineer') as FormArray;
    // if (this.engineer.length > 11) {
    //   this.commonService.responseMessageSnackBar('Maximum 12 engineers can be added', 'failed-snackbar');
    //   return;
    // }
    this.engineer.push(this.createEngineer(data));
  }

  /**
   * remove engineer
   * @param index
   * created by : Biswajit
   */
  removeEngineer(index) {
    if (index > 0) {
      this.removed_company_engineer_ids.push(this.engineer.value[index].id);
      this.engineer.removeAt(index);
      this.engineerResources.splice(index, 1);
    }
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  // SUBMISSION SUCCESS DIALOG OPEN.
  openConsultantSuccessDialog() {
    // this.dialog.open(ConsultantSuccessModalComponent, {
    //   panelClass: 'invite-success-modal',
    //   closeOnNavigation: true
    // });
  }

  // SUBMISSION NOTALLOWED DIALOG OPEN.
  openConsultantNotallowedDialog() {
    // this.dialog.open(ConsultantNotallowedModalComponent, {
    //   panelClass: 'invite-success-modal',
    //   closeOnNavigation: true
    // });
  }

  /**
   * file change handle
   * @param event
   * created by : Biswajit
   */
  fileChangeHandler(event) {
    this.companyLogoFile = event.target.files[0];
    if (!this.companyLogoFile) {
      return;
    }
    if (this.companyLogoFile.size > 5242880) {
      // this.commonService.responseMessageSnackBar('Image size cannot be greater than 5MB!', 'failed-snackbar');
      this.commonService.commonToastrMessage('Image size cannot be greater than 5MB!', 'error', 'Error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.companyLogo = event.target.result;
    };
    reader.readAsDataURL(this.companyLogoFile);
  }

  /**
   * cvUpload
   * @param event
   * @param index
   * created by : Biswajit
   */
  cvUpload(event, index) {
    let file = event.target.files[0];

    if (! this.validCVTypes.includes(file.type)) {
      this.commonService.commonToastrMessage("Please upload valid pdf file.", 'error', 'Error');
      event.target.value = '';
      return;
    }

    // restrict upto 10 mb
    if (file.size > (10 * 1024 * 1024)) {
      this.commonService.commonToastrMessage("File size can not be larger than 10 mb", 'error', 'Error');
      event.target.value = '';
      return;
    }

    this.cvPhoto = file;

    let urlData = {
      url: 'upload-company-engineer-cv'
    };

    let formData = new FormData();
    formData.append("image", this.cvPhoto);

    this.commonService.httpCallPostformdata(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        if (this.engineerResources[index][0]) {
          this.engineerResources[index][0].id = resp.data.id;
          this.engineerResources[index][0].resource_url = resp.data.resource_url;
          this.engineerResources[index][0].resource_type = resp.data.resource_type;
        } else {
          this.engineerResources[index][0] = resp.data;
        }

        event.target.value = "";
      } else {
        this.toastr.error(resp.message, 'Error', {
          timeOut: 2000,
          positionClass: 'toast-bottom-right'
        });
      }
    });
  }

  profileUpload(event, index) {
    let file = event.target.files[0];

    if (! this.validImageTypes.includes(file.type)) {
      this.commonService.commonToastrMessage("Please upload valid image.", 'error', 'Error');
      event.target.value = '';
      return;
    }

    this.engineerProfilePhoto = file;

    let urlData = {
      url: 'upload-company-engineer-profile-picture'
    };

    let formData = new FormData();
    formData.append("image", this.engineerProfilePhoto);

    this.commonService.httpCallPostformdata(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        if (this.engineerResources[index][1]) {
          this.engineerResources[index][1].id = resp.data.id;
          this.engineerResources[index][1].resource_url = resp.data.resource_url;
          this.engineerResources[index][1].resource_type = resp.data.resource_type;
        } else {
          this.engineerResources[index][1] = resp.data;
        }

        event.target.value = "";
      } else {
        this.toastr.error(resp.message, 'Error', {
          timeOut: 2000,
          positionClass: 'toast-bottom-right'
        });
      }
    });
  }

  previousProjectPhotos(event) {
    this.previousProjectImages.push(...event.addedFiles);
  }

  onRemove(index) {
    this.previousProjectImages.splice(index, 1);
  }

  /**
   * Submit consultant form
   */
  onSubmit() {
    this.consultantFormSubmitted = true;

    if (this.consultantForm.invalid) {
      this.commonService.commonToastrMessage('Please check your form', 'error', 'Error');
      return;
    }

    let urlData = {
      url: 'admin/update-admin-consultant-profile'
    };
    let isEmpty = false;
    let formValues = this.consultantForm.value;

    // For engineers
    let engineerData = [];
    let engineers = this.consultantForm.get('engineer').value;
    engineers.forEach((engineer, index) => {
      if (engineer.engineer_name === "") {
        isEmpty = true;
      }

      let data = {
        "id"               : engineer.id,
        "name"             : engineer.engineer_name,
        "type"             : engineer.engineer_type,
        "linkedIn_profile" : engineer.linkedin_profile,
        "facebook_profile" : engineer.fb_profile,
        "instagram_profile": engineer.instagram_profile,
        "resource_ids"     : this.engineerResources[index].filter(resource => resource.id !== 0).map(resource => resource.id)
      };

      engineerData.push(data);
    });

    // For services
    let servicesData = [];
    let services = this.consultantForm.get('services').value;
    services.forEach((service, index) => {
      if (service.service_name === "") {
        isEmpty = true;
      }

      let data = {
        "company_services_id": service.id,
        "Service_name"       : service.service_name,
        "Service_description": service.service_desc,
      };

      servicesData.push(data);
    });

    if (isEmpty) {
      this.commonService.commonToastrMessage('Please check your form', 'error', 'Error');
      return;
    }

    let sendData = {
      admin_consultant_id        : this.consultantId,
      company_name               : formValues.company_name,
      phone                      : formValues.phone_num,
      facebook_link              : formValues.fb_link,
      linkedIn_link              : formValues.linkedin_link,
      instagram_link             : formValues.instagram_link,
      website_link               : formValues.website_link,
      pinterest_link             : formValues.pinterest_link,
      whatsapp_no                : formValues.whatsapp_num,
      company_profile            : formValues.company_profile,
      company_engineers          : engineerData,
      remove_compnay_engineer_ids: this.removed_company_engineer_ids,
      company_services           : servicesData,
      company_services_delete    : this.removed_service_ids,
    };

    this.commonService.httpCallPut(urlData, sendData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
        this.goBack();
      } else {
        this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      }
    }, error => {
      this.commonService.log(error);
    });
  }

  /**
   * Get profile data
   * method: POST
   * output: resp
   * created by: Biswajit
   */
  getProfileData() {
    let urlData = {
      url: 'admin/consultation-hub'
    };

    let formData = {
      // user_id: 27
      user_id: this.consultantId
    };

    this.commonService.httpCallPost(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];
        let _self = this;

        if (response) {

          if (response.company_logo) {
            this.companyLogo = this.baseImageUrl + response.company_logo;
          }

          // reset controls
          this.consultantForm.setControl('services', this.fb.array([]));
          this.consultantForm.setControl('engineer', this.fb.array([]));

          this.consultantForm.patchValue({
            company_name   : response.company_name,
            phone_num      : response.phone,
            fb_link        : response.facebook_link,
            linkedin_link  : response.linkedIn_link,
            instagram_link : response.instagram_link,
            website_link   : response.website_link,
            pinterest_link : response.pinterest_link,
            whatsapp_num   : response.whatsapp_no,
            company_profile: response.company_profile,
          });

          response.company_services.forEach(service => {
            _self.addServices(service);
          });

          response.company_engineers.forEach(engineer => {
            _self.addEngineer(engineer);
          });

          this.previousProjectImages = response.resources.filter(resource => resource.is_active === 1);
        }
      }
    });
  }

  /**
   * Go back
   */
  goBack(): void {
    this.router.navigateByUrl('/consultant-hub', { state: { pageState:this.pageState }});
  }

  /**
   * Open image modal
   * @param e Event
   * Created by: Biswajit
   */
  openMediaModal(e) {
    BigPicture({
      el: e.target,
    });
  }

  selectCompanyLogo() {
    this.companyLogoInput.nativeElement.click();
  }

    /**
   * Set the logo file
   * @param files Files
   */
  uploadCompanyLogo(files: FileList) {
    let file = files.item(0);

    if (!file) {
      return;
    }

    if (! this.validImageTypes.includes(file.type)) {
      this.commonService.commonToastrMessage("Please upload valid image.", 'error', 'Error');
      return;
    }

    this.companyLogoFile = file;

    // Upload Image
    let urlData = {
      url: 'admin/update-company-logo'
    };
    let formData = new FormData();
    formData.append("id", this.consultantId.toString());
    formData.append("company_logo", this.companyLogoFile);

    this.commonService.httpCallPutformdata(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.companyLogo = this.baseImageUrl + resp.resp;
        this.companyLogoInput.nativeElement.value = "";
      } else {
        this.commonService.commonToastrMessage(resp.msg, 'error', 'Error');
      }
    });
  }

  /**
   * Select previous project
   */
  selectPreviousProjectImage() {
    this.projectImageInput.nativeElement.click();
  }

  /**
   * Upload previous project images
   * @param files FileList
   */
  uploadPreviousProjectImage(files: FileList) {
    let file = files.item(0);

    if (!file) {
      return;
    }

    if (! this.validImageTypes.includes(file.type)) {
      this.commonService.commonToastrMessage("Please upload valid image.", 'error', 'Error');
      return;
    }

    // Upload Image
    let urlData = {
      url: 'admin/pervious-projects'
    };
    let formData = new FormData();
    formData.append("admin_consultant_id", this.consultantId.toString());
    formData.append("image", file);

    this.commonService.httpCallPostformdata(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.getProfileData();
        this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
        this.projectImageInput.nativeElement.value = "";
      } else {
        this.commonService.commonToastrMessage(resp.msg, 'error', 'Error');
      }
    });
  }

  /**
   * Remove previous project image
   * @param prevProjectImage Object
   */
  removePreviousProjectImage(prevProjectImage) {
    Swal.fire({
      title: 'Are you sure to delete this image?',
      text: '',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          let urlData = {
            url: 'admin/project-image-status'
          }

          let formData = {
            id: prevProjectImage.id
          }

          this.commonService.httpCallPut(urlData, formData)
          .subscribe(resp => {
            resolve(resp);
          }, error => this.commonService.log(error));
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        let resp = result.value;

        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getProfileData();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }
    });
  }

}
