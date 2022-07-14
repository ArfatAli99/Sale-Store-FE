import { Component, OnInit } from '@angular/core';

import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';
import { PagerService } from '../../../_services/pager.service';

@Component({
  selector: 'app-home-slider-listing',
  templateUrl: './home-slider-listing.component.html',
  styleUrls: ['./home-slider-listing.component.scss']
})
export class HomeSliderListingComponent implements OnInit {

  slides: [] = [];    
  imageTypes = ['jpg', 'png', 'jpeg'];
  baseImageUrl = environment.upload_url;
  pageOffset: number = 1;
	limitPerPage = environment.contactFormListLimit;
	countTotalPage: number;
	pager: any = {};
  isPageSetFirstTime: Boolean = false;  

  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
  ) { }

  ngOnInit() {
    this.getSliders();
    this.setDefaultPaginationParameter();
  }

  /**
   * Get all slides
   */
  getSliders() {
    let urlData = {
      url: `admin/images?type=home_slider&page=${this.pageOffset}&limit=${this.limitPerPage}`,
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.slides = resp.data.rows;
        this.countTotalPage = resp.data.count;
        if (!this.isPageSetFirstTime) {
          this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
          this.isPageSetFirstTime = true;
        }        
      }
    });
  }

  /**
   * Set default pagination parameter
   */
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
		this.getSliders();
	}  

}
