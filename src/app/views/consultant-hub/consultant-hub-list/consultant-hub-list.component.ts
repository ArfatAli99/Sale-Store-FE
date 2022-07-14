import { AriticalRequestDialogComponent } from './aritical-request-dialog/aritical-request-dialog.component';
import { InviteRequestDialogComponent } from './invite-request-dialog/invite-request-dialog.component';
import { PagerService } from '../../../_services/pager.service';
import { CommonserviceService } from '../../../commonservice.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-consultant-hub-list',
	templateUrl: './consultant-hub-list.component.html',
	styleUrls: ['./consultant-hub-list.component.scss']
})
export class ConsultantHubComponent implements OnInit {
	@ViewChild('consultantId') consultantIdField: ElementRef;

	consultantListDetails = [];
	pageOffset: number = 1;
	search_text: string = '';
	limitPerPage = environment.consultantHubListLimit;
	countTotalPage: number;
	pager: any = {};
	isPageSetFirstTime: Boolean = false;

	shareArticleForm: FormGroup;
	articleTopicFormSubmitted: boolean = false;
	articlesTopicListDetails: any = [];

	constructor(
		private commonService: CommonserviceService,
		private pagerService: PagerService,
		private toastr: ToastrService,
		public dialog: MatDialog,
		private fb: FormBuilder
	) {
		this.setDefaultPaginationParameter();
	}

	ngOnInit() {
		this.getConsultationHub();
		this.generateShareArticleForm();
	}


	/**
   * Gets consultation hub
   */
	getConsultationHub() {
		this.search_text = this.search_text ? this.search_text.trim() : '';
		let postData = {
			page: this.pageOffset,
			limit: this.limitPerPage,
			search_text: this.search_text
		};
		let urlData = {
			// url: 'admin/consultationHub',
			url: 'admin/consultation-hub?page=' + this.pageOffset + '&limit=' + this.limitPerPage + '&search_text=' + this.search_text,
		};
		this.commonService.httpCallGet(urlData)
			.subscribe(data => {
				if (data.status == environment.HTTP_STATUS_OK) {
					this.consultantListDetails = data.data.rows;
					this.countTotalPage = data.totalcounts;
					if (!this.isPageSetFirstTime) {
						this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
						this.isPageSetFirstTime = true;
					}
				}
			});
	}


	/**
	 * Actives or deactive consult hub
	 * @param _index
	 */
	activeOrDeactiveConsultHub(_index) {
		let status = 1;
		if (this.consultantListDetails[_index].is_active == 1) {
			status = 0;
		}
		var updateUserStatusModel = {
			id: this.consultantListDetails[_index].id,
			is_active: status,
		}

		var urldata = {
			url: 'admin/consultion-hub-change-status'
		}

		this.commonService.httpCallPut(urldata, updateUserStatusModel)
			.subscribe(data => {
				if (data.status == environment.HTTP_STATUS_OK) {
					this.commonService.commonToastrMessage(data.msg, 'success', 'Success');
					this.consultantListDetails[_index].is_active = status;
				} else {
					this.commonService.commonToastrMessage(data.msg, 'error', 'Error');
				}
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
		this.getConsultationHub();
	}


	/**
	 * Consults hub status change
	 * @param index
	 */
	consultHubStatusChange(index) {
		let msg = "Do you want to Deactive ?";
		if (this.consultantListDetails[index].is_active == 0) {
			msg = "Do you want to active ?";
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
				this.activeOrDeactiveConsultHub(index);
			}
		});

	}

	/**
	 * Sets default pagination parameter
	 */
	setDefaultPaginationParameter() {
		this.pageOffset = history.state['pageState'] ? history.state['pageState'] : 1;
		this.countTotalPage = 0;
		this.isPageSetFirstTime = false;
	}

	/**
	 * Clears all
	 */
	clearAll() {
		this.search_text = '';
		this.pageOffset = 1;
		this.isPageSetFirstTime = false;
		this.getConsultationHub();
	}

	/**
	 * Searchs users listing component
	 */
	search() {
		this.pageOffset = 1;
		this.isPageSetFirstTime = false;
		this.getConsultationHub();
	}

	/**
	 * Invitations request
	 */
	invitationRequest() {
		const dialogRef = this.dialog.open(InviteRequestDialogComponent, {
			width: '600px',
			data: {}
		});

		dialogRef.afterClosed().subscribe(result => {
			// console.log('The dialog was closed');

		});

	}

	/**
	 * Opens ariticle
	 */
	openAriticleInviteModal(index) {
		this.consultantIdField.nativeElement.value = this.consultantListDetails[index].id;
		this.articlesTopicListng(this.consultantListDetails[index].id);


		// this.dialog.open(AriticalRequestDialogComponent, {
		// 	width: '600px',
		// 	data: this.consultantListDetails[index].id
		// });

		// dialogRef.afterClosed().subscribe(result => {
		// 	// console.log('The dialog was closed');

		// });
	}

	articlesTopicListng(consulttantHubId: number) {
		let urlData = {
		  url: 'admin/topics?uid=' + consulttantHubId
		};

		this.commonService.httpCallGet(urlData)
		.subscribe(data => {
			// console.log(data.data);
			if (data.status == environment.HTTP_STATUS_OK) {
				this.articlesTopicListDetails = data.data.rows;
				$("#invitationModal").modal("show");
			}
		});
	}

	generateShareArticleForm() {
		this.shareArticleForm = this.fb.group({
			articleTopic: new FormControl('', [Validators.required]),
		});
	}

	get shareArticleFormControls() {
		return this.shareArticleForm.controls;
	}

	shareArticle() {
		this.articleTopicFormSubmitted = true;

		if (this.shareArticleForm.valid) {
			let consultantId = this.consultantIdField.nativeElement.value;

			let postData = {
				uid: consultantId,
				topic_id: this.shareArticleForm.get('articleTopic').value
			};

			let urlData = {
				url: 'admin/invite-articles',
			};

			this.commonService.httpCallPost(urlData, postData)
			.subscribe(data => {
				if (data.status == environment.HTTP_STATUS_CREATED) {
					this.commonService.commonToastrMessage(data.message, 'success', 'Success');
					$("#invitationModal").modal("hide");
				} else {
					this.commonService.commonToastrMessage(data.message, 'error', 'Error');
				}
			});
		}
	}

	closeModal() {
		$("#invitationModal").modal("hide");
		this.shareArticleForm.markAsPristine();
		this.shareArticleForm.markAsUntouched();
	}

}
