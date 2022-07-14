import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { CommonserviceService } from '../../../commonservice.service';
import { PagerService } from '../../../_services';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.scss']
})
export class UserProjectsComponent implements OnInit {

  userId: number;

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
    private route: ActivatedRoute,
    private commonService: CommonserviceService,
    private toastr: ToastrService,
    private router: Router,
    private pagerService: PagerService,
  ) {
    this.userId = +this.route.snapshot.paramMap.get('id');
		this.setDefaultPaginationParameter();
		this.projectStatuses = this.commonService.getProjectStatuses();
  }

  ngOnInit() {
    this.getProjectList();
  }

  getProjectList() {
    let urlParams = {
      user_id    : this.userId,
      page       : this.pageOffset,
      limit      : this.limitPerPage,
      search_text: this.search_text,
      search     : this.project_type,
      order      : this.activeSortText
    }

    let urlData = {
      url: 'admin/user-project-details?' + this.commonService.convertToUrlParams(urlParams),
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
			if (resp.status === environment.HTTP_STATUS_OK) {
        if (resp.data.rows[0].user_type == 1) {
          this.projectList = resp.data.rows[0].projects;
        } else if(resp.data.rows[0].user_type == 2 || resp.data.rows[0].user_type == 3) {
          this.projectList = resp.data.rows[0].projects.map(item => item.project);
        }

				this.countTotalPage = resp.total_count;
				if (!this.isPageSetFirstTime) {
				  this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
				  this.isPageSetFirstTime = true;
				}
			}
    }, error => {
      console.log(error);
    });
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
   * Set default pagination
   */
	setDefaultPaginationParameter() {
		this.pageOffset = history.state['pageState'] ? history.state['pageState'] : 1;
		this.countTotalPage = 0;
		this.isPageSetFirstTime = false;
	}

}
