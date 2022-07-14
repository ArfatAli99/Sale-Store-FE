import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PagerService } from './../../../_services/pager.service';
import { Component, OnInit } from '@angular/core';
import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-users-listing',
	templateUrl: './users-listing.component.html',
	styleUrls: ['./users-listing.component.scss']
})

export class UsersListingComponent implements OnInit {

	usersListDetails = [];
	pageOffset: number = 1;
	user_type: number = 0;
	search_text: string = '';
	limitPerPage = environment.userListLimit;
	countTotalPage: number;
	pager: any = {};
	isPageSetFirstTime: Boolean = false;
	rejectForm: FormGroup;
	rejectFormSubmitted: boolean = false;
	activeUserIndex: number;

	// sort users
	activeSort = 'id';
	activeSortBy = 'desc';
	activeSortText = '';

	constructor(
		private commonService: CommonserviceService,
		private pagerService: PagerService,
		private toastr: ToastrService,
		private fb: FormBuilder,
	) {
		this.setDefaultPaginationParameter();
	}

	ngOnInit() {
		this.getUsersList();
		this.generateRejectForm();
	}

	/**
	 * Gets users list
	 */
	getUsersList() {
		let postData = {
			page       : this.pageOffset,
			limit      : this.limitPerPage,
			user_type  : this.user_type,
			search_text: this.search_text,
			order      : this.activeSortText
		};

		let urlData = {
			url: 'admin/fetch-user-list',
		};

		this.commonService.httpCallPost(urlData, postData)
		.subscribe(data => {
			if (data.status == environment.HTTP_STATUS_OK) {
				this.usersListDetails = data.data.rows;
				this.countTotalPage = data.data.count;
				if (!this.isPageSetFirstTime) {
					this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
					this.isPageSetFirstTime = true;
				}
			}
		});
	}

	/**
	 * Reject Form
	 */
	generateRejectForm() {
		this.rejectForm = this.fb.group({
			reason: new FormControl('', [Validators.required]),
		});
	}

	/**
	 * Actives or deactive user
	 * @param _index
	 */
	activeOrDeactiveUser(_index, reason = "") {
		let status = 1;

		if (this.usersListDetails[_index].is_active == 1) {
			status = 0;
		}

		var updateUserStatusModel = {
			user_id: this.usersListDetails[_index].id,
			is_active: status,
			reason: reason
		}

		var urldata = {
			url: 'admin/update-user-status'
		}

		this.commonService.httpCallPost(urldata, updateUserStatusModel)
		.subscribe(data => {
			if (data.status == environment.HTTP_STATUS_OK) {
				this.toastr.success(data.msg, 'Success', {
					timeOut: 2000,
					positionClass: 'toast-bottom-right'
				});
				this.usersListDetails[_index].is_active = status;
				$("#rejectModal").modal("hide");
			} else {
				this.toastr.error(data.msg, 'Error', {
					timeOut: 2000,
					positionClass: 'toast-bottom-right'
				});
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
		this.getUsersList();
	}

	userStatusActiveDeactive(index) {
		let user = this.usersListDetails[index];
		let msg = "Do you want to deactivate " + user.full_name + "?";

		this.activeUserIndex = index;

		if (user.is_active == 0) {
			msg = "Do you want to activate " + user.full_name + "?";
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
				this.activeOrDeactiveUser(index);
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
	 * Clears all
	 */
	clearAll() {
		this.search_text = '';
		this.user_type = 0;
		this.pageOffset = 1;
		this.isPageSetFirstTime = false;
		this.getUsersList();
	}

	/**
	 * Searchs users listing component
	 */
	search() {
		this.pageOffset = 1;
		this.search_text = this.search_text ? this.search_text.trim() : '';
		this.isPageSetFirstTime = false;
		this.getUsersList();
	}

	get formControls() {
		return this.rejectForm.controls;
	}

	/**
	 * Open the reject contractor form application
	 *
	 * @param index Integer
	 */
	openRejectContractorApplication(index) {
		this.activeUserIndex = index;
		let user = this.usersListDetails[this.activeUserIndex];
		console.log('user: ', user);
		if (user.user_type == 3) {
			if (user.is_active == 1) {
				if (user.is_complete == 0) {
					this.commonService.commonToastrMessage('Contractor application is not completed.', 'error', 'Error');
					return;
				}

				$("#rejectModal").modal("show");
			} else {
				this.commonService.commonToastrMessage('User is not active.', 'error', 'Error');
			}
		}
	}

	/**
	 * Save contractor rejection
	 */
	saveContractorRejection() {
		this.rejectFormSubmitted = true;

		if (this.rejectForm.valid) {
			let user = this.usersListDetails[this.activeUserIndex];

			if (user.user_type == 3) {
				if (user.is_active == 1) {
					this.commonService.log(user);

					let urlData = {
						url: 'admin/reject'
					};

					let formData = {
						id: user.id,
						description: this.rejectForm.get('reason').value
					};

					this.commonService.httpCallPut(urlData, formData)
					.subscribe(resp => {
						if (resp.status === environment.HTTP_STATUS_OK) {
							this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
							this.closeModal();
							this.getUsersList();
						} else {
							this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
						}
					}, error => {
						console.log(error);
					});
				} else {
					this.commonService.commonToastrMessage('User is not active.', 'error', 'Error');
				}
			}
		}
	}

	/**
	 * Close Popup
	 */
	closeModal() {
		this.rejectForm.reset();
		this.rejectFormSubmitted = false;
		$("#rejectModal").modal("hide");
	}

	/**
	 * Approve the contractor application
	 * @param index Integer
	 */
	approveContractorApplication(index) {
		this.activeUserIndex = index;
		let user = this.usersListDetails[this.activeUserIndex];

		if (user.is_complete == 0) {
			this.commonService.commonToastrMessage('Contractor application is not completed.', 'error', 'Error');
			return;
		}

		Swal.fire({
			title: '',
			text: 'Do you want to approve this application?',
			type: 'warning',
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: 'Approve',
			cancelButtonText: 'Close',
			allowOutsideClick: false
		}).then((result) => {
			if (result.value) {
				this.commonService.log(user);

				let urlData = {
					url: 'admin/approved'
				};

				let formData = {
					id: user.id
				};

				this.commonService.httpCallPut(urlData, formData)
				.subscribe(resp => {
					if (resp.status === environment.HTTP_STATUS_OK) {
						this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
						this.getUsersList();
					} else {
						this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
					}
				}, error => {
					console.log(error);
				});
			}
		});
	}

	/**
	* Sort users by type
	*
	* @param sortBy string
	*/
	sortUsers(sortBy) {
		let oldActiveSort = this.activeSort;
		let oldActiveSortBy = this.activeSortBy;

		this.activeSort = sortBy;

		if (oldActiveSort === sortBy) {
			this.activeSortBy = oldActiveSortBy === 'asc' ? 'desc' : 'asc';
		} else {
			this.activeSortBy = 'asc';
		}

		switch(this.activeSort) {
			case 'id':
				this.activeSortText = this.activeSortBy == 'asc' ? 'idasc' : '';
				break;

			case 'name':
				this.activeSortText = this.activeSortBy == 'asc' ? 'nameasc' : 'namedsc';
				break;

			// TODO: Email sort
			case 'email':
				this.activeSortText = this.activeSortBy == 'asc' ? 'emailasc' : 'emaildsc';
				break;

			case 'date':
				this.activeSortText = this.activeSortBy == 'asc' ? 'createdatasc' : 'createdatdsc';
				break;
		}

		this.pageOffset = 1;
		this.isPageSetFirstTime = false;

		this.getUsersList();
	}

	/**
	 * Login as an user from admin panel
	 * @param user object
	 */
	impersonateUser(user) {
		let postData = {
			id  : user.id,
			role: user.user_type
		};

		let urlData = {
			url: 'admin/impersonate',
		};

		this.commonService.httpCallPost(urlData, postData)
		.subscribe(resp => {
			if (resp.status === environment.HTTP_STATUS_OK) {				
				if (window.location.hostname === "localhost") {
					let baseurl = window.prompt("What is your frontend base url?", "http://localhost:4200/");

					if (baseurl) {					
						window.open(baseurl + "/impersonate/" + resp.data, "_blank");
					} else {
						this.commonService.commonToastrMessage("Please enter an url first!", 'error', 'Error');
					}
				} else {
					window.open(environment.base_url + "impersonate/" + resp.data, "_blank");
				}
			} else {
				this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
			}
		}, error => this.commonService.log(error));
	}


	approveRejectConsultant(index, status) {
		let user = this.usersListDetails[index];
		let btnTitle = status == 1 ? "Approve" : "Reject";
		let btnColor = status == 1 ? '#3085d6' : '#d33';

		Swal.fire({
			title: '',
			text: `Do you want to ${btnTitle.toLowerCase()} this consultant profile?`,
			type: 'warning',
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: btnTitle,
			confirmButtonColor: btnColor,
			cancelButtonText: 'Close',
			allowOutsideClick: false
		}).then((result) => {
			if (result.value) {
				let urlData = {
					url: 'admin/consultion-hub-change-status'
				};

				let formData = {
					id: user.id,
					is_active: status
				};

				this.commonService.httpCallPut(urlData, formData)
				.subscribe(resp => {
					if (resp.status === environment.HTTP_STATUS_OK) {
						this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
						this.getUsersList();
					} else {
						this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
					}
				}, error => {
					console.log(error);
				});
			}
		})
		.catch(error => console.log(error));
	}

}
