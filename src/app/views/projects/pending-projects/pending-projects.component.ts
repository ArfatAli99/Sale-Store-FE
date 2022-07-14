import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { CommonserviceService } from '../../../commonservice.service';
import { PagerService } from '../../../_services/pager.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../_services/notification.service';

@Component({
  selector: 'app-pending-projects',
  templateUrl: './pending-projects.component.html',
  styleUrls: ['./pending-projects.component.scss']
})
export class PendingProjectsComponent implements OnInit {

  	projectList = [];
	pageOffset: number = 1;
	limitPerPage = environment.projectListLimit;
	countTotalPage: number;
	pager: any = {};
	isPageSetFirstTime: Boolean = false;
	projectStatuses = [];

	// project search
	search_text: string = '';
	project_type: string = '';

	// reject form
	rejectForm: FormGroup;
	rejectFormSubmitted: boolean = false;

	// active project info
	activeDropdown;
	activeProjectIndex: number;
	activeProjectId: number;
	activeProjectStatus: string;

	// sort projects
	activeSort = 'id';
	activeSortBy = 'desc';
	activeSortText = '';

  constructor(
		private commonService: CommonserviceService,
		private pagerService: PagerService,
		private fb: FormBuilder,
		private router: Router,
		private notificationService: NotificationService
  ) {
		this.setDefaultPaginationParameter();
		this.projectStatuses = this.commonService.getProjectStatuses();
  	}

	ngOnInit() {
		this.getProjectList();
		this.generateRejectForm();
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
		this.getProjectList();
	}

  	/**
   * Get project list
   */
  	getProjectList() {
		let urlParams = {
			page       : this.pageOffset,
			limit      : this.limitPerPage,
			search_text: this.search_text,
			search     : 'pending',
			order      : this.activeSortText
		};

		let urlData = {
			url: 'admin/project-listsort?' + this.commonService.convertToUrlParams(urlParams),
		};

		this.commonService.httpCallGet(urlData)
		.subscribe(resp => {
			if (resp.status === environment.HTTP_STATUS_CREATED) {
				this.projectList = resp.data.rows;
				this.countTotalPage = resp.total_count;
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
   * Change project status
   * @param id integer
   */
  	statusDropdownChanged(index: number, e) {
		let msg = '';
		let status = e.target.value;
		let project = this.projectList[index];

		this.activeProjectIndex = index;
		this.activeProjectId = project.id;
		this.activeProjectStatus = project.status;
		this.activeDropdown = e.target;

		switch(status) {
			case '2':
				if (project.project_stages.length <= 2) {
					this.commonService.commonToastrMessage('Please create some stages first!', 'error', 'Error');
					this.router.navigate(['/projects/edit/', project.id]);
				} else {
					msg = 'Do you want to approve this project?';
					this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '', index, status);
				}
			break;

			case '3':
				let days = this.commonService.getDayDiff(project.createdAt);
				this.commonService.log('days: ', days);

				msg = 'Do you want to reject this project?';

				if (project.status === 0) {
					if (days > 30) {
						this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '', index, status);
 					} else {
						this.revertBackDropDown(index);
						this.commonService.commonToastrMessage('Project can be closed which is in draft stage for more than 30 days.', 'error', 'Error', 'toast-bottom-right', '6000');
					}
				} else {
					this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '', index, status);
				}

				break;

			case '4':
				msg = 'Do you want to archive this project?';
				this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '', index, status);
				break;
		}
	}

	/**
	 * Change project status
	 * @param index Integer
	 * @param status String
	 */
	changeProjectStatus(index, status) {
		let project = this.projectList[index];
		let projectId = project.id;

		let urldata = {
			url: 'admin/project-status-change'
		};

		var formData = {
			project_id: projectId,
			status: status,
		};

		this.commonService.httpCallPut(urldata, formData)
		.subscribe(resp => {
			if (resp.status === environment.HTTP_STATUS_CREATED) {
				this.commonService.commonToastrMessage(resp.message, 'success', 'Success');

				if (status == 2) {
					// Emit Notification
					this.notificationService.sendMessage({
						"notification_from" : 0,
						"notification_to"   : project.user_id,
						"project_id"        : projectId,
						"title"             : "Your project has been approved by admin",
						"description"       : "",
						'title_arabic'      : 'وافق المشرف على مشروعك',
						'description_arabic': '',
						"type"              : "both"
					});
				} else if (status == 4) {
					// Emit Notification
					this.notificationService.sendMessage({
						"notification_from" : 0,
						"notification_to"   : project.user_id,
						"project_id"        : projectId,
						"title"             : "Your project has been archived by admin",
						"description"       : "",
						'title_arabic'      : "تمت أرشفة مشروعك من قبل المشرف",
						'description_arabic': '',
						"type"              : "both"
					});
				}

			} else {
				this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      	}

      	this.getProjectList();
		}, error => {
			this.commonService.log(error);
		});
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
		cancel_btn_txt: string, confirm_btn_txt: string, outsite_clickable: any, msg: string, index, status) {

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
				if (status === '3') {
					$("#rejectModal").modal("show");
				} else {
					this.changeProjectStatus(index, status);
				}
			} else {
				this.revertBackDropDown(index);
			}
		});
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
	 * Clears all
	 */
	clearAll() {
		this.search_text = '';
		this.project_type = '';
		this.pageOffset = 1;
		this.isPageSetFirstTime = false;
		this.getProjectList();
	}

	/**
	 * Searchs users listing component
	 */
	search() {
		this.pageOffset = 1;
		this.search_text = this.search_text ? this.search_text.trim() : '';
		this.isPageSetFirstTime = false;
		this.getProjectList();
	}

	/**
	 * Get project status
	 * @param projectStatus Integer
	 */
	getProjectStatus(projectStatus: number) {
		return this.projectStatuses[projectStatus];
	}

	/**
	 * Reject Form
	 */
	generateRejectForm() {
		this.rejectForm = this.fb.group({
			reason: new FormControl('', [Validators.required]),
			reasonTitle: new FormControl('', [Validators.required]),
		});
	}

	/**
	 * Get form controls
	 */
	get formControls() {
		return this.rejectForm.controls;
	}

	/**
	 * Save Reject Content
	 */
	savePendingRejectionContent() {
		this.rejectFormSubmitted = true;

		if (this.rejectForm.valid) {
			let postData = {
				project_id : this.activeProjectId,
				title: this.rejectForm.value.reasonTitle,
				description: this.rejectForm.value.reason,
				status     : 3,
			};

			let urlData = {
				url: 'admin/project-reject',
			};

			this.commonService.httpCallPost(urlData, postData)
			.subscribe(resp => {
				if (resp.status === environment.HTTP_STATUS_CREATED) {
					let project = this.projectList[this.activeProjectIndex];
					$("#rejectModal").modal("hide");
					this.getProjectList();
					this.commonService.commonToastrMessage(resp.message, 'success', 'Success');

					// Emit Notification
					this.notificationService.sendMessage({
						"notification_from" : 0,
						"notification_to"   : project.user_id,
						"project_id"        : this.activeProjectId,
						"title"             : "Your project has been returned by admin",
						"description"       : this.rejectForm.value.reasonTitle + "<br>" + this.rejectForm.value.reason,
						"title_arabic"      : "أعاد المشرف مشروعك",
						"description_arabic": this.rejectForm.value.reasonTitle + "<br>" + this.rejectForm.value.reason,
						"type"              : "both"
					});
				} else {
					this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
				}
			}, error => {
				this.commonService.log(error);
			});
		}
	}

	/**
	 * Sort projects by type
	 * @param sortBy string
	 */
	sortProjects(sortBy) {
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
				this.activeSortText = this.activeSortBy == 'asc' ? 'id' : '';
				break;

			case 'name':
				this.activeSortText = this.activeSortBy == 'asc' ? 'projectnameasc' : 'projectnamedsc';
				break;

			// TODO: Username sort
			// case 'user':
			// 	this.activeSortText = this.activeSortBy == 'asc' ? '' : '';
			// 	break;

			case 'created_at':
				this.activeSortText = this.activeSortBy == 'asc' ? 'creatAtasc' : 'creatAtdsc';
				break;

			case 'date':
				this.activeSortText = this.activeSortBy == 'asc' ? 'newupdate' : 'lastupdate';
				break;
		}

		this.pageOffset = 1;
		this.isPageSetFirstTime = false;

		this.getProjectList();
	}

	/**
	 * Close Popup
	 */
	closeModal() {
		this.revertBackDropDown(this.activeProjectIndex);
		this.rejectForm.reset();
		$("#rejectModal").modal("hide");
	}

	/**
	 * Revert back old status
	 * @param index Integer
	 */
	revertBackDropDown(index) {
		this.activeDropdown.value = this.activeProjectStatus;
		this.projectList[index].status = this.activeProjectStatus.toString();
	}

}
