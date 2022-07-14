import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';
import {default as Hashids} from "hashids";

@Component({
  selector: 'app-contact-form-submission-details',
  templateUrl: './contact-form-submission-details.component.html',
  styleUrls: ['./contact-form-submission-details.component.scss']
})
export class ContactFormSubmissionDetailsComponent implements OnInit {

  contactForm: FormGroup;
  contactFormId: any;
  clientName: string = '';
  clientType: string = '';
  clientEmail: string = '';
  clientPhone: string = '';
  description: string = '';
  pageState: number;
  hashids;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.hashids = new Hashids('', 10);
    // let id = +this.route.snapshot.paramMap.get('id');
    this.contactFormId = +this.route.snapshot.paramMap.get('id');


		if (this.contactFormId) {
			this.getFormDetails();
    }
    
    this.pageState = history.state['page'] ? history.state['page'] : 1;    
  }

  getFormDetails() {
    let urlData = {
      url: 'admin/ask-me'
    };
    let sendData = {
      id: this.contactFormId
    };

    this.commonService.httpCallPost(urlData, sendData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let response = resp.data.rows[0];

        this.clientName  = response.name;
        this.clientType  = response.type;
        this.clientEmail = response.email;
        this.clientPhone = response.phone;
        this.description = response.description;
      }
    }, error => {
      this.commonService.log(error);
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/contact-forms', { state: { pageState: this.pageState } });
  }

}
