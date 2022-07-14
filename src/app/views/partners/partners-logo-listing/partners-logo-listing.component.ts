import { Component, OnInit } from '@angular/core';

import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';
import { PagerService } from '../../../_services/pager.service';

@Component({
  selector: 'app-partners-logo-listing',
  templateUrl: './partners-logo-listing.component.html',
  styleUrls: ['./partners-logo-listing.component.scss']
})
export class PartnersLogoListingComponent implements OnInit {

  logos: [] = [];  
  baseImageUrl = environment.upload_url;
  pageOffset: number = 1;
	limitPerPage = environment.partnersLogoListLimit;
	countTotalPage: number;
	pager: any = {};
  isPageSetFirstTime: Boolean = false;

  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
  ) {
    this.setDefaultPaginationParameter();
  }

  ngOnInit() {
    this.getLogos();
  }

  /**
   * Get all logos
   */
  getLogos() {
    let urlData = {
      url: `admin/images?resource_type=image&type=home_partner&page=${this.pageOffset}&limit=${this.limitPerPage}`,
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === 200) {
        this.logos = resp.data.rows;
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
		this.getLogos();
	}

}
