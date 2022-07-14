import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { CommonserviceService } from '../../../commonservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import BigPicture from 'bigpicture';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-add-edit-slider',
  templateUrl: './add-edit-slider.component.html',
  styleUrls: ['./add-edit-slider.component.scss']
})
export class AddEditSliderComponent implements OnInit {

  sliderForm: FormGroup;
  slideId: number;
  cardTitle: string = 'Add Slide';
  submitBtnText: string = "Submit";
  imageName: string = 'Select image';
  videoName: string = 'Select video';
  imageToUpload;
  videoToUpload;
  uploadedVideoId;
  uploadedImageId;
  uploadedImage: string = '';
  uploadedVideo: string = '';
  baseImageUrl = environment.upload_url;
  validVideoTypes = ["video/mp4"];
  validImageTypes = ["image/png", 'image/jpeg', 'image/jpg'];
  pageState: number;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.slideId = +this.route.snapshot.paramMap.get('id');
    this.generateForm();
    this.pageState = history.state['page'] ? history.state['page'] : 1;

		if (this.slideId) {
      this.cardTitle = 'Edit Slide';
      this.submitBtnText = "Save Changes";
			this.getSlideDetails();
		}
  }

  /**
   * Generate the form
   */
  generateForm() {
    this.sliderForm = this.fb.group({
      slideImage: new FormControl('', [Validators.required]),
      slideVideo: new FormControl('', [Validators.required]),
      slideText: new FormControl('', []),
      slideStatus: new FormControl(1, []),
    });
  }

    /**
   * Upload slide image
   * @param files Files
   */
  postMethodImage(files: FileList) {
    let file = files.item(0);

    if (! this.validImageTypes.includes(file.type)) {
      this.commonService.commonToastrMessage("Please upload valid image.", 'error', 'Error');
      return;
    }

    this.imageToUpload = file;
    this.imageName = this.imageToUpload.name;
    this.uploadImage();
  }

  /**
   * Upload image
   */
  uploadImage() {
    let _self = this;

    return new Promise((resolve, reject) => {
      if (!this.imageToUpload && !this.slideId) {
        reject("Please upload an image.");
        return;
      }

      let formData = new FormData();
      formData.append("image", this.imageToUpload);

      if (this.slideId) { // for existing slide
        let urlData = {
          url: 'admin/slider-image-upload'
        };

        formData.append("id", this.slideId.toString());

        this.commonService.httpCallPutformdata(urlData, formData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_CREATED) {
            let response = resp.data;

            if (response) {
              this.uploadedImage = response.resource_url;
              this.imageName = 'Select image';
              this.uploadedImageId = this.slideId = response.id;
              this.uploadedImage = response.resource_thumbnail;
              resolve();
            } else {
              reject("Something went wrong. Please try again later.");
            }
          } else {
            this.commonService.commonToastrMessage(resp.msg, 'error', 'Error');
          }
        }, error => this.commonService.log(error));
      } else { // for new slide
        let urlData = {
          url: 'admin/slider-image'
        };

        formData.append("type", "home_slider");
        formData.append("resource_type", "image");

        this.commonService.httpCallPostformdata(urlData, formData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_CREATED) {
            let response = resp.data;

            if (response) {
              this.uploadedImage = response.resource_url;
              this.imageName = 'Select image';
              this.uploadedImageId = this.slideId = response.id;
              this.uploadedImage = response.resource_thumbnail;
              resolve();
            } else {
              reject("Something went wrong. Please try again later.");
            }
          } else {
            this.commonService.commonToastrMessage(resp.msg, 'error', 'Error');
          }
        }, error => this.commonService.log(error));
      }

    });
  }

  /**
   * Upload slide video
   * @param files Files
   */
  postMethodVideo(files: FileList) {
    let file = files.item(0);

    if (! this.validVideoTypes.includes(file.type)) {
      this.commonService.commonToastrMessage("Please upload valid video.", 'error', 'Error');
      return;
    }

    this.videoToUpload = file;
    this.videoName = this.videoToUpload.name;

    if (this.slideId) {
      let formData = new FormData();
      formData.append("image", this.videoToUpload);
      formData.append("id", this.slideId.toString());

      let urlData = {
        url: 'admin/image-home-slider-update'
      };

      this.commonService.httpCallPutformdata(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          let response = resp.data.rows[0];
          // console.log("video res", response);
          if (response) {
            this.uploadedVideoId = response.id;
            this.uploadedVideo   = response.resource_url;
            this.videoName       = 'Select video';
          }
        } else {
          this.commonService.commonToastrMessage(resp.msg, 'error', 'Error');
        }
      });
    }
  }

  /**
   * Upload video
   */
  uploadVideo() {
    // console.log("edit upload");
    let _self = this;

    return new Promise((resolve, reject) => {
      if (! this.videoToUpload) {
        reject("Please upload an video.");
        return;
      }

      let formData = new FormData();
      formData.append("image", this.videoToUpload);

      if (this.slideId) { // for existing slide
        let urlData = {
          url: 'admin/image-home-slider-update'
        };

        formData.append("id", this.slideId.toString());

        this.commonService.httpCallPutformdata(urlData, formData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_OK) {
            let response = resp.data.rows[0];

            if (response) {
              _self.uploadedVideo   = response.resource_url;
              _self.videoName       = 'Select video';
              resolve();
            }
          } else {
            this.commonService.commonToastrMessage(resp.msg, 'error', 'Error');
          }
        });
      }
    });
  }

  /**
   * Get slide details
   */
  getSlideDetails() {
    let urlData = {
      url: `admin/images`
    };

    let formData = {
      id: this.slideId
    };

    this.commonService.httpCallPost(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];

        if (response) {
          this.slideId = response.id;
          this.uploadedImage = response.resource_thumbnail;
          this.uploadedVideo = response.resource_url;

          this.sliderForm.patchValue({
            slideText: response.resource_description,
            slideStatus: response.is_active,
          });
        }
      }
    });
  }

  /**
   * Save the slide content
   */
  async saveSlide() {
    if (! this.imageToUpload && !this.slideId) {
      this.commonService.commonToastrMessage("Please upload an image.", 'error', 'Error');
      return;
    }

    if (this.slideId) {
      this.saveContent();
    } else {
      await this.uploadImage()
      .then(resp => {
        if (this.videoToUpload) {
          this.uploadVideo();
        }

        this.saveContent();
      })
      .catch(error => {
        this.commonService.commonToastrMessage(error, 'error', 'Error');
      });
    }
  }


  saveContent() {
    let urlData = {
      url: 'admin/slider-description'
    };

    let formData = {
      id: this.slideId,
      resource_description: this.sliderForm.get('slideText').value,
      is_active: +this.sliderForm.get('slideStatus').value,
    };

    this.commonService.httpCallPut(urlData, formData)
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
  * Go back to previous page
  */
  goBack(): void {
    this.router.navigateByUrl('/home-sliders', { state: { pageState: this.pageState } });
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
