import { Component, OnInit } from '@angular/core';

import { PagerService } from './../../../_services/pager.service';
import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-scopes-listing',
  templateUrl: './project-scopes-listing.component.html',
  styleUrls: ['./project-scopes-listing.component.scss']
})
export class ProjectScopesListingComponent implements OnInit {

  projectScopes: [] = [];
	pageOffset: number = 1;
	limitPerPage = environment.scopesListLimit;
	countTotalPage: number;
	pager: any = {};
  isPageSetFirstTime: Boolean = false;

  search_text:string = '';
  sow_type:string = '';
  sow_scope_type:string = '';

  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
  ) {
    this.setDefaultPaginationParameter();
  }

  ngOnInit() {
    this.getProjectScopes();
  }

  /**
   * Get all project scopes
   */
  getProjectScopes() {
    let paramData = {
      page       : this.pageOffset,
      limit      : this.limitPerPage,
      search_text: this.search_text,
      type       : this.sow_type,
      scope_type : this.sow_scope_type
    };

    let urlData = {
      url: 'admin/project-scope?' + this.commonService.convertToUrlParams(paramData)
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.projectScopes = resp.data.rows;
        this.countTotalPage = resp.data.count;
        if (!this.isPageSetFirstTime) {
          this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
          this.isPageSetFirstTime = true;
        }
      } else {
        this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      }
    }, error => {
      console.error(error);
    });
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
    this.getProjectScopes();
  }

  /**
   * Set default pagination
   */
	setDefaultPaginationParameter() {
		this.pageOffset = history.state['pageState'] ? history.state['pageState'] : 1;
		this.countTotalPage = 0;
		this.isPageSetFirstTime = false;
  }

  /**
   * Display confirm popup before delete
   * @param index integer
   */
  deleteProjectScope(index) {
    let msg = 'Do you want to delete this project scope?';

    this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '', index);
  }

  /**
	 * Commons swal alert
	 * @param title_txt
	 * @param alert_type
	 * @param show_cancel_btn
	 * @param show_confirm_btn
	 * @param cancel_btn_txt
	 * @param confirm_btn_txt
	 * @param outsite_clickable
	 * @param msg
	 * @param index
	 */
	commonSwalAlert(title_txt: string, alert_type: any, show_cancel_btn: any, show_confirm_btn: any,
		cancel_btn_txt: string, confirm_btn_txt: string, outsite_clickable: any, msg: string, index) {

		Swal.fire({
			title: title_txt,
			type: alert_type,
			showConfirmButton: show_confirm_btn,
			showCancelButton: show_cancel_btn,
			confirmButtonText: confirm_btn_txt,
			cancelButtonText: cancel_btn_txt,
			allowOutsideClick: outsite_clickable
		}).then((result) => {
			if (result.value) {
				this.deleteScope(index);
			}
		});

  }

  /**
   * Delete the scope
   * @param _index integer
   */
  deleteScope(_index) {
		var updateModel = {
			id: _index,
			is_deleted: 1,
		}

		var urldata = {
			url: 'admin/project-scope'
		};

		// this.commonService.httpCallPut(urldata, updateModel)
    // .subscribe(data => {
    //   if (data.status === environment.HTTP_STATUS_OK) {
    //     this.commonService.commonToastrMessage(data.message, 'success', 'Success');
    //     this.getProjectScopes();
    //   } else {
    //     this.commonService.commonToastrMessage(data.message, 'error', 'Error');
    //   }
    // });

		this.commonService.httpCallDelete(urldata, updateModel)
    .subscribe(data => {
      if (data.status === environment.HTTP_STATUS_OK) {
        this.commonService.commonToastrMessage(data.message, 'success', 'Success');
        this.getProjectScopes();
      } else {
        this.commonService.commonToastrMessage(data.message, 'error', 'Error');
      }
    });
  }

	/**
	 * Clears all
	 */
	clearAll() {
		this.search_text = '';
		this.sow_type = '';
		this.sow_scope_type = '';
		this.pageOffset = 1;
		this.isPageSetFirstTime = false;
		this.getProjectScopes();
	}

	/**
	 * Searchs users listing component
	 */
	search() {
		this.pageOffset = 1;
		this.search_text = this.search_text ? this.search_text.trim() : '';
		this.isPageSetFirstTime = false;
		this.getProjectScopes();
	}

}
