import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import BigPicture from 'bigpicture';

@Component({
  selector: 'app-add-edit-partner-logo',
  templateUrl: './add-edit-partner-logo.component.html',
  styleUrls: ['./add-edit-partner-logo.component.scss']
})
export class AddEditPartnerLogoComponent implements OnInit {
  @ViewChild('imageElem') imageElem: ElementRef;
  logoId: number;
  fileName: string = 'Select file';
  cardTitle = "Add Partner Logo";
  submitBtnText:string = "Submit";
  partnerLogoForm: FormGroup;

  logoUrl: any = "";
  baseImageUrl = environment.upload_url;
  fileToUpload;
  validImageTypes = ["image/png", 'image/jpeg', 'image/jpg'];
  pageState: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.generateForm();

    this.logoId = +this.route.snapshot.paramMap.get('id');
    this.pageState = history.state['page'] ? history.state['page'] : 1;

		if (this.logoId) {
      this.cardTitle = 'Edit Partner Logo';
      this.submitBtnText = 'Save Changes';
      this.fileName = 'Change file';
			this.getLogoDetails();
		}
  }

  /**
   * Generate the form
   */
  generateForm() {
    this.partnerLogoForm = this.fb.group({
      partnerLogo: new FormControl(''),
      partnerLink: new FormControl(''),
      isActive: new FormControl('')
    });
  }

  /**
   * Get partner logo details
   */
  getLogoDetails() {
    let urlData = {
      url: `admin/images`
    };
    let formData = {
      id: this.logoId
    };

    this.commonService.httpCallPost(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];

        this.logoUrl = this.baseImageUrl + response.resource_url;

        this.partnerLogoForm.patchValue({
          partnerLink: response.external_link,
          isActive: response.is_active
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

    if (! this.validImageTypes.includes(file.type)) {
      this.commonService.commonToastrMessage("Please upload valid image.", 'error', 'Error');
      return;
    }

    this.fileToUpload = file;
    this.fileName = this.fileToUpload.name;

    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.logoUrl = myReader.result;
    }
    myReader.readAsDataURL(file);
  }

  /**
   * Upload the logo
   */
  handleLogo() {
    if (! this.fileToUpload && ! this.logoId) {
      this.commonService.commonToastrMessage("Please select an image.", 'error', 'Error');
      return;
    }

    let url = 'admin/upload-image-home-partner';
    let method_name = 'httpCallPostformdata';
    let is_active = (this.partnerLogoForm.get('isActive').value === true || this.partnerLogoForm.get('isActive').value === "" || this.partnerLogoForm.get('isActive').value === 1) ? '1' : '0';
    let partner_link = this.partnerLogoForm.get('partnerLink').value;

    let formData = new FormData();
    formData.append('resource_type', 'image');
    formData.append('type', 'home_partner');
    formData.append('external_link', partner_link);
    formData.append('is_active', is_active);

    if (this.fileToUpload) {
      formData.append('image', this.fileToUpload);
    }

    if (this.logoId) {
      url = 'admin/upload-image-home-partner';
      method_name = 'httpCallPutformdata';
      formData.append('id', this.logoId.toString());
    }

    if (this.logoId && ! this.fileToUpload) {
      url = 'admin/image-change-status';
      method_name = 'httpCallPut';
      formData = <any> {
        id: this.logoId,
        external_link: partner_link,
        is_active: is_active.toString()
      };
    }

    let urldata = {
      url: url
    }

    this.commonService[method_name](urldata, formData)
    .subscribe(data => {
      if (data.status === environment.HTTP_STATUS_OK) {
        Swal.fire({
          title: data.msg,
          type: 'success',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        }).then((result) => {
          if (result.value) {
            this.goBack();
          }
        })
      } else {
        this.toastr.error(data.msg, 'Error', {
          timeOut: 2000,
          positionClass: 'toast-bottom-right'
        });
      }
    });
  }

  /**
  * Go back to previous page
  */
  goBack(): void {
    this.router.navigateByUrl('/partners-logo', { state: { pageState: this.pageState } });
  }

  /**
   * Open image modal
   * @param e Event
   */
  openMediaModal(e) {
    BigPicture({
      el: e.target,
    });
  }

}
