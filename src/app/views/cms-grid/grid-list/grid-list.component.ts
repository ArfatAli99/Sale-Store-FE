import { Component, OnInit } from '@angular/core';
import { CommonserviceService } from '../../../commonservice.service';
import { PagerService } from '../../../_services';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss']
})
export class GridListComponent implements OnInit {
  cmslist: [] = [];
  baseImageUrl = environment.upload_url;
  pageOffset: number = 1;
  limitPerPage = environment.gridItemLimit;
  countTotalPage: number;
	pager: any = {};
  isPageSetFirstTime: Boolean = false;

   /**
   * Creates an instance.
   * input: @param commonservice 
   * @param pagerService
   * created by : Biswajit
   */
  constructor( private commonService: CommonserviceService,
    private pagerService: PagerService) {
      this.setDefaultPaginationParameter();
     }

 /**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by : Biswajit
   */
     ngOnInit() {
    this.getCmsList();
  }

  /**
   * Get all cms list
   * method : GET
   * output: resp
   * created by: Priyanjali
   */
  getCmsList() {
    let urlData = {
      url: `admin/cms-grid?offset=${this.pageOffset - 1}&limit=${this.limitPerPage}`,
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === 200) {
        this.cmslist = resp.data.rows;

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

  /**
   * Set default pagination parameter
   * created by: Priyanjali
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
 * created by: Priyanjali
 */
	setPage(page: number) {
		if (page < 1 || page > this.pager.totalPages) {
			return;
		}
		// get pager object from service
		this.pager = this.pagerService.getPager(this.countTotalPage, page, this.limitPerPage);
		// get current page of items
		this.pageOffset = page;
		this.getCmsList();
	}
}
