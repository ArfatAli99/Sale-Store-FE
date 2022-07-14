import { Component, OnInit } from '@angular/core';

import { CommonserviceService } from '../../../commonservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages-listing',
  templateUrl: './pages-listing.component.html',
  styleUrls: ['./pages-listing.component.scss']
})
export class PagesListingComponent implements OnInit {

  pagesList: [];
  page: number = 1;
  limit: number = 10;

  constructor(
    private commonService: CommonserviceService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getPages();
  }

  /**
   * Get all CMS pages
   */
  getPages() {
    let urldata = {
      url: `admin/fetchCms?limit=${this.limit}&page=${this.page}`
    }

    this.commonService.httpCallPost(urldata, {
      page: this.page,
      limit: this.limit
    })
    .subscribe(resp => {
      if (resp.status == 1) {
        this.pagesList = resp.data.rows;
      }
    });
  }

}
