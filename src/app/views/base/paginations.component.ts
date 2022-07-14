import { Component, Input, ViewEncapsulation  } from '@angular/core';

@Component({
  templateUrl: 'paginations.component.html',
  styles: ['.pager li.btn:active { box-shadow: none; }'],
  encapsulation: ViewEncapsulation.None
})
export class PaginationsComponent {

  /**
   * Creates an instance.
   * input: @param totalItems
   * @param currentPage
   * @param smallnumPages
   * @param maxSize
   * @param bigCurrentPage
   * @param bigTotalItems
   * created by : Biswajit
   */
  constructor() { }

  totalItems: number = 64;
  currentPage: number   = 4;
  smallnumPages: number = 0;

  maxSize: number = 5;
  bigTotalItems: number = 675;
  bigCurrentPage: number = 1;
  numPages: number = 0;

  currentPager: number   = 4;

  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  pageChanged(event: any): void {
  }
}
