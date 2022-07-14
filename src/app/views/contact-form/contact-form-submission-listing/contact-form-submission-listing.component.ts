import { Component, OnInit } from '@angular/core';

import { CommonserviceService } from '../../../commonservice.service';
import { PagerService } from '../../../_services/pager.service';
import { environment } from '../../../../environments/environment';
import {default as Hashids} from "hashids";

@Component({
  selector: 'app-contact-form-submission-listing',
  templateUrl: './contact-form-submission-listing.component.html',
  styleUrls: ['./contact-form-submission-listing.component.scss']
})
export class ContactFormSubmissionListingComponent implements OnInit {

  submissions = [];
  pageOffset: number = 1;
	limitPerPage = environment.contactFormListLimit;
	countTotalPage: number;
	pager: any = {};
  isPageSetFirstTime: Boolean = false;  
  hashids;

  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
  ) {
    this.setDefaultPaginationParameter();
  }

  ngOnInit() {
    this.hashids = new Hashids('', 10);
    this.getSubmissions();
  }

  getSubmissions() {
    let urlData = {
      url: `admin/ask-me?offset=${this.pageOffset - 1}&limit=${this.limitPerPage}`,
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.submissions = resp.data.rows;
        this.countTotalPage = resp.data.count;
        if (!this.isPageSetFirstTime) {
          this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
          this.isPageSetFirstTime = true;
        }
      }
    }, error => {
      this.commonService.log(error);
    });
  }

  setDefaultPaginationParameter() {
		this.pageOffset = history.state['pageState'] ? history.state['pageState'] : 1;
		this.countTotalPage = 0;
		this.isPageSetFirstTime = false;
  }
  
  	/**
 * Sets page
 * @param page 
 * @returns  
 */
	setPage(page: number) {
		if (page < 1 || page > this.pager.totalPages) {
			return;
		}
		// get pager object from service
		this.pager = this.pagerService.getPager(this.countTotalPage, page, this.limitPerPage);
		// get current page of items
		this.pageOffset = page;
		this.getSubmissions();
	}

}
