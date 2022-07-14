import { CommonserviceService } from './../../../commonservice.service';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PagerService } from '../../../_services/pager.service';

@Component({
  selector: 'app-consultant-invitation',
  templateUrl: './consultant-invitation.component.html'
})
export class ConsultantInvitationComponent implements OnInit {

  pageState: number;

  pageOffset:number = 1;
  countTotalPage: number;
  limitPerPage = environment.userListLimit;
  pager: any = {};
  search_text: string = '';
  isPageSetFirstTime: Boolean = false;
  invitationDetails = [];


  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
     private router: Router,
     ) {

  }

  /**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by : Biswajit
   */
  ngOnInit() {

    this.getInvitationData();
    this.pageState = history.state['page'] ? history.state['page'] : 1;
  }



  getInvitationData() {
      console.log(' the invitation is working');

    const urlData = {
      url: `admin/inviteconsultant-list?page=${this.pageOffset}&limit=${this.limitPerPage}&search_text=${this.search_text}`,
    };
    this.commonService.httpCallGet(urlData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
            console.log(resp);
            this.invitationDetails = resp.data.rows;
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

  setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }
      this.pager = this.pagerService.getPager(this.countTotalPage, page, this.limitPerPage);
      this.pageOffset = page;
      this.getInvitationData();
  }

  setDefaultPagination() {
      this.pageOffset = history.state['pageState'] ? history.state['pageState'] : 1;
      this.countTotalPage = 0;
      this.isPageSetFirstTime = false;
  }

    /**
 * Clears all
 */
clearAll() {
    this.search_text = '';
    this.getInvitationData();
    this.pageOffset = 1;
    this.isPageSetFirstTime = false;
  }

/**
	 * Search
	 */
  search() {
    this.pageOffset = 1;
    this.search_text = this.search_text ? this.search_text.trim() : '';
    this.isPageSetFirstTime = false;
    this.getInvitationData();
  }

}
