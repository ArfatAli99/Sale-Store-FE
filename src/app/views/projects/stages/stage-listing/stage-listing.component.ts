import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonserviceService } from '../../../../commonservice.service';
import { PagerService } from '../../../../_services/pager.service';


@Component({
  selector: 'app-stage-listing',
  templateUrl: './stage-listing.component.html',
  styleUrls: ['./stage-listing.component.scss']
})
export class StageListingComponent implements OnInit {

  stages = [];
  pageOffset: number = 1;
	limitPerPage = environment.stagesListLimit;
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
    this.getStages();
  }
  
  /**
   * Fetch stages
   */
  getStages() {
		let urlParams = {
			page: this.pageOffset,
			limit: this.limitPerPage
    };
    
		let urlData = {
			url: 'admin/fetch-stage?' + this.commonService.convertToUrlParams(urlParams),
    };
    
		this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status == environment.HTTP_STATUS_OK) {
        this.stages = resp.data.rows;
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
		// console.log(history.state['pageState']);
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
    this.getStages();
  }  

}
