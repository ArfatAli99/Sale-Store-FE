import { Component, OnInit } from '@angular/core';
import { CommonserviceService } from '../../../../commonservice.service';
import { PagerService } from '../../../../_services/pager.service';
import { environment } from '../../../../../environments/environment';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-scope-info-list',
  templateUrl: './scope-info-list.component.html',
  styleUrls: ['./scope-info-list.component.scss']
})
export class ScopeInfoListComponent implements OnInit {

  scopedetail: []=[];
  search_text:string='';
   section_category :string='';
   group_name:string='';
   page_no:number;

  //pagination settings
  pageOffset: number = 1;
  limitPerPage = environment.scopeInfoListLimit;
	countTotalPage: number;
	pager: any = {};
  isPageSetFirstTime: Boolean = false;
  scopeInfos: any = [];

  // languageGroups:any;
  // languageForm:FormGroup;
  // languageFormSubmitted:boolean=false;
  // languageId:number;

  /**
   * Creates an instance.
   * input: @param commonservice 
   * @param pagerService
   * created by : Biswajit
   */
  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
  ) {
    this.setDefaultPaginationParameter();
  }

  /**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by Biswajit
   */
  ngOnInit() {
    this.getScopeInfos();
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
  * craeted by Biswajit
  */
	setPage(page: number) {
		if (page < 1 || page > this.pager.totalPages) {
			return;
		}
		// get pager object from service
		this.pager = this.pagerService.getPager(this.countTotalPage, page, this.limitPerPage);
		// get current page of items
		this.pageOffset = page;
		this.getScopeInfos();
	}

  /**
   * Get Scope infos
   * created by Biswajit
   * purpose: to get scope info
   */
 getScopeInfos() {
    let urlData = {
      page       : this.pageOffset,
      limit      : this.limitPerPage,
      search_text: this.search_text,

    };

    let postData = {
      url: 'admin/scope-map?' + this.commonService.convertToUrlParams(urlData), // admin/scope-map
    };

    this.commonService.httpCallGet(postData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.scopeInfos = resp.data.rows;

        this.countTotalPage = resp.data.count;
        if (!this.isPageSetFirstTime) {
          this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
          this.isPageSetFirstTime = true;
        }
      }
    }, error => this.commonService.log(error) );
  }

  /**
	 * Clears all
   * purpose: to clear all from the search bar
   * created by: Momitha
	 */
	clearAll() {
		this.search_text = '';
		this.group_name = '';
		this.pageOffset = 1;
		this.isPageSetFirstTime = false;
		this.getScopeInfos();
	}

	/**
	 * Searchs users listing component
   * purpose: to search elements
   * craeted by: Momitha
	 */
	search() {
		this.pageOffset = 1;
		this.search_text = this.search_text ? this.search_text.trim() : '';
    this.page_no = null;
		this.isPageSetFirstTime = false;
    this.getScopeInfos();

  }


  // getScopeInfos() {
  //   let urlData = {
  //     url: `admin/scope-map?offset=${this.pageOffset - 1}&limit=${this.limitPerPage}`,http://localhost:4055/api/admin/scope-map?page=1&limit=10
  //   };

  //   this.commonService.httpCallGet(urlData)
  //   .subscribe(resp => {
  //     if (resp.status === environment.HTTP_STATUS_OK) {
  //       this.scopeInfos = resp.data.rows;
  //       this.countTotalPage = resp.data.count;
  //       if (!this.isPageSetFirstTime) {
  //         this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
  //         this.isPageSetFirstTime = true;
  //       }
  //     }
  //   }, error => {
  //     this.commonService.log(error);
  //   });
  // }

}
