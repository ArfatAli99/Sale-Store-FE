import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonserviceService } from '../../../commonservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-site-settings-detail',
  templateUrl: './site-settings-detail.component.html',
  styleUrls: ['./site-settings-detail.component.scss']
})
export class SiteSettingsDetailComponent implements OnInit {

  siteSettingsForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.generateForm();
    this.getSiteSettings();
  }

  /**
   * Generate the form
   */
  generateForm() {
    this.siteSettingsForm = this.fb.group({
      adminContact         : ['', [Validators.minLength(8), Validators.pattern('^[0-9]{8}$')]],
      adminEmail           : ['', [Validators.email]],
      maxBidSubmissionLimit: [],
      facebookLink         : [],
      linkedinLink         : [],
      twitterLink          : [],
      instagramLink        : [],
      partnerText          : [],
      serviceText          : [],
    });
  }

  /**
   * Get form controls
   */
  get formControls() {
    return this.siteSettingsForm.controls;
  }

  /**
   * Get site settings
   */
  getSiteSettings() {
    let urlData = {
      url: 'admin/sitesettings'
    };
    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];

        this.siteSettingsForm.patchValue({
          adminContact         : response.admin_contact,
          adminEmail           : response.admin_email,
          maxBidSubmissionLimit: response.max_tender_submission_limit,
          facebookLink         : response.facebook_link,
          linkedinLink         : response.linkedin_link,
          twitterLink          : response.twitter_link,
          instagramLink        : response.instagram_link,
          partnerText          : response.partner_text,
          serviceText          : response.service_text,
        });
      }
    });
  }

  /**
   * Update site settings
   */
  updateSettings() {
    this.submitted = true;

    if (this.siteSettingsForm.valid) {

      let formValues = this.siteSettingsForm.value;

      let urlData = {
        url: 'admin/sitesettings'
      };

      let formData = {
        admin_contact              : formValues.adminContact,
        admin_email                : formValues.adminEmail,
        max_tender_submission_limit: formValues.maxBidSubmissionLimit,
        facebook_link              : formValues.facebookLink,
        linkedin_link              : formValues.linkedinLink,
        twitter_link               : formValues.twitterLink,
        instagram_link             : formValues.instagramLink,
        partner_text               : formValues.partnerText,
        service_text               : formValues.serviceText
      };

      this.commonService.httpCallPut(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          Swal.fire({
            title: resp.msg,
            type: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              this.getSiteSettings();
            }
          })
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      });
    } else {
      this.commonService.commonToastrMessage("Please check your form", 'error', 'Error');
    }
  }

}
