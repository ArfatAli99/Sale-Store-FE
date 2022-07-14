import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonserviceService } from '../../../commonservice.service';
import { PagerService } from '../../../_services';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-article-topic-listing',
	templateUrl: './article-topic-listing.component.html',
	styleUrls: ['./article-topic-listing.component.scss']
})
export class ArticleTopicListingComponent implements OnInit {

	articlesTopicListDetails = [];
	pageOffset: number = 1;
	search_text: string = '';
	limitPerPage = environment.articelListingLimit;
	countTotalPage: number;
	pager: any = {};
	isPageSetFirstTime: Boolean = false;


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
   * created by : Biswajit
   */
      ngOnInit() {
		this.articleTopicListng();
	}

	/**
 * Sets default pagination parameter
 * craeted by Sourav
 */
	setDefaultPaginationParameter() {
		this.pageOffset = history.state['pageState'] ? history.state['pageState'] : 1;
		this.countTotalPage = 0;
		this.isPageSetFirstTime = false;
	}

	/**
 * Users status active deactive
 * @param index
 * created by: Sourav
 */
	articleStatusActiveDeactive(index) {
		let msg = "Do you want to deactivate?";
		if (this.articlesTopicListDetails[index].is_active == 0) {
			msg = "Do you want to activate?";
		}
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
	 * created by: Sourav
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
				this.activeOrDeactiveArticle(index);
			}
		});

	}

  /**
   * Clears all
   * purpose: to clear all from the search bar
   * created by: Momitha
   */
	clearAll() {
		this.search_text = '';
		this.pageOffset = 1;
		this.isPageSetFirstTime = false;
		this.articleTopicListng();
	}


	/**
	 * Searchs users listing component
   * purpose: to search elements
   * craeted by: Momitha
	 */
	search() {
		this.isPageSetFirstTime = false;
		this.pageOffset = 1;
		this.articleTopicListng();
	}


	/**
	 * Articles listng
	 * method: GET
	 * output: data
	 * created by: Sourav
	 */
	articleTopicListng() {
		this.search_text = this.search_text ? this.search_text.trim() : '';

		let urlData = {
			url: 'admin/article-topics?page=' + this.pageOffset + '&limit=' + this.limitPerPage + '&search_text=' + this.search_text,
		};

		this.commonService.httpCallGet(urlData)
		.subscribe(data => {
			if (data.status == environment.HTTP_STATUS_OK) {
				this.articlesTopicListDetails = data.data.rows;
				this.countTotalPage = data.data.count;
				if (!this.isPageSetFirstTime) {
					this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
					this.isPageSetFirstTime = true;
				}
			}
		});
	}

	/**
	 * Sets page
	 * @param page integer
	 * @returns
	 * craeted by : Sourav
	 */
	setPage(page: number) {
		if (page < 1 || page > this.pager.totalPages) {
			return;
		}
		// get pager object from service
		this.pager = this.pagerService.getPager(this.countTotalPage, page, this.limitPerPage);
		// get current page of items
		this.pageOffset = page;
		this.articleTopicListng();
	}

	/**
	   * Actives or deactive user
	   * @param _index
	   * method: PUT
	   * ouput: data
	   * created by: Sourav
	   */
	activeOrDeactiveArticle(_index) {
		let status = 1;
		if (this.articlesTopicListDetails[_index].is_active == 1) {
			status = 0;
		}
		var model = {
			id: this.articlesTopicListDetails[_index].id,
			status: status,
		}

		var urldata = {
			url: 'admin/article-topic-change-status'
		}

		this.commonService.httpCallPut(urldata, model)
			.subscribe(data => {
				if (data.status == environment.HTTP_STATUS_OK) {
					this.commonService.commonToastrMessage(data.message, 'success', 'Success');
					this.articlesTopicListDetails[_index].is_active = status;
				} else {
					this.commonService.commonToastrMessage(data.message, 'error', 'Error');
				}
			});
	}

}
