import { Component, TemplateRef, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CommonserviceService } from '../../commonservice.service';
import { PagerService } from '../../_services/pager.service';
import { default as Hashids } from 'hashids';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  templateDetails = [];
  pageOffset: number = 1;
  countTotalPage: number;
  isPageSetFirstTime: Boolean = false;
  hashids;

  modalRef: BsModalRef;
  message: string;
  selectedTempId: any;
  search_text: string = '';
  limitPerPage = environment.userListLimit;
  pager:any={};

  // Save Template Form
  saveTemplateForm: FormGroup;
  saveTemplateFormSubmitted: boolean = false;

  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
    private modalService: BsModalService,
    private fb: FormBuilder,
  ) {

  }
  ngOnInit() {
    this.hashids = new Hashids('', 10);
    this.getTemplatesList();
    this.generateSaveTemplateForm();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    const urlData = {
      url: `admin/project-template-delete`,
    };
    const sendData = {
      id: this.selectedTempId,
    }

    this.commonService.httpCallPut(urlData, sendData).subscribe(resp => {
      this.getTemplatesList();
      this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
    }, error => {
      console.log('error');
    }
    );

  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }


  getTemplatesList() {
    const urlData = {
      url: `admin/project-template-list?search_text=${this.search_text}&page=${this.pageOffset}&limit=${this.limitPerPage}`,
    };
    this.commonService.httpCallGet(urlData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.templateDetails = resp.data.rows;
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

  setPage(page:number){
    if(page<1 || page> this.pager.totalPages){
      return;
    }
    this.pager=this.pagerService.getPager(this.countTotalPage, page, this.limitPerPage);
    this.pageOffset=page;
    this.getTemplatesList();
  }

  /**
	 * Set default pagination parameter
	 */
	setDefaultPaginationParameter() {
		this.pageOffset = history.state['pageState'] ? history.state['pageState'] : 1;
		this.countTotalPage = 0;
		this.isPageSetFirstTime = false;
	}

  deleteTemplateList(temp, confirmationModalTemplate) {
    this.selectedTempId = temp.id;
    this.openModal(confirmationModalTemplate);

  }

  /**
 * Clears all
 */
  clearAll() {
    this.search_text = '';
    this.getTemplatesList();
    this.pageOffset=1;
    this.isPageSetFirstTime=false;
  }

	/**
	 * Search
	 */
  search() {
    this.pageOffset=1;
    this.search_text = this.search_text ? this.search_text.trim() : '';
    this.isPageSetFirstTime=false;
    this.getTemplatesList();
  }

  /**
   * Open save template modal
   */
  openTemplateModal() {
    $("#saveTemplateModal").modal("show");
  }  

    /**
   * Close save template modal
   */
  closeSaveTemplateModal() {
    this.saveTemplateForm.reset();
    this.saveTemplateFormSubmitted = false;
		$("#saveTemplateModal").modal("hide");
  }

  /**
   * Generate Save Template Form
   */
  generateSaveTemplateForm() {
    this.saveTemplateForm = this.fb.group({
      templateName: new FormControl('', [Validators.required])
    });
  }  

  /**
   * Get Save Template Form Controls
   */
  get saveTemplateFormControls() {
    return this.saveTemplateForm.controls;
  }  

  /**
   * Save stages as template
   */
  saveAsTemplate() {
    this.saveTemplateFormSubmitted = true;

    if (this.saveTemplateForm.valid) {
      // Submit Data
      let urlData = {
        url: 'admin/template-add'
      };

      let formData = {
        name: this.saveTemplateForm.value.templateName,
      };

      this.commonService.httpCallPost(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.closeSaveTemplateModal();
          this.getTemplatesList();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });
    }
  }  
}