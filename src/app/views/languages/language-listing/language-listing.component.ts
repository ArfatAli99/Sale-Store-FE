import { Component, OnInit } from '@angular/core';

import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';
import { PagerService } from '../../../_services/pager.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-language-listing',
  templateUrl: './language-listing.component.html',
  styleUrls: ['./language-listing.component.scss']
})
export class LanguageListingComponent implements OnInit {
  languages: [] = [];
  search_text: string = '';
  group_name: string = '';
  page_no: number;

  // pagination settings
  pageOffset: number = 1;
	limitPerPage = environment.languageListLimit;
	countTotalPage: number;
	pager: any = {};
  isPageSetFirstTime: Boolean = false;

  languageGroups: any;
  languageForm: FormGroup;
  languageFormSubmitted: boolean = false;
  languageId: number;

  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
    private fb: FormBuilder,
  ) {
    this.setDefaultPaginationParameter();
    this.languageGroups = this.commonService.getLanguageGroups();
  }

  ngOnInit() {
    this.getLanguages();
    this.generateForm();
  }

  /**
   * Get all language string
   */
  getLanguages() {
    let urlData = {
      page       : this.pageOffset,
      limit      : this.limitPerPage,
      search_text: this.search_text,
      group_name : this.group_name
    };

    let postData = {
      url: 'admin/language?' + this.commonService.convertToUrlParams(urlData),
    };

    this.commonService.httpCallGet(postData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.languages = resp.data.rows;

        this.countTotalPage = resp.no_of_languages;
        if (!this.isPageSetFirstTime) {
          this.pager = this.pagerService.getPager(this.countTotalPage, this.pageOffset, this.limitPerPage);
          this.isPageSetFirstTime = true;
        }
      }
    }, error => this.commonService.log(error) );
  }

  /**
   * Generate language form
   */
  generateForm() {
    this.languageForm = this.fb.group({
      groupName  : new FormControl({value: '', disabled: true}, [Validators.required]),
      languageKey: new FormControl({value: '', disabled: true}, [Validators.required]),
      englishKey : new FormControl('', [Validators.required]),
      arabicKey  : new FormControl('', [Validators.required]),
      isActive   : new FormControl(1),
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
    this.getLanguages();
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
		this.group_name = '';
		this.pageOffset = 1;
		this.isPageSetFirstTime = false;
		this.getLanguages();
	}

	/**
	 * Searchs users listing component
	 */
	search() {
		this.pageOffset = 1;
		this.search_text = this.search_text ? this.search_text.trim() : '';
    this.group_name = this.group_name ? this.group_name.trim() : '';
    this.page_no = null;
		this.isPageSetFirstTime = false;
		this.getLanguages();
  }

  /**
   * Open Language modal
   */
  openLanguageModal(index: number) {
    let language = <any> this.languages[index];

    this.languageForm.patchValue({
      groupName  : language.group_name,
      languageKey: language.field_key,
      englishKey : language.english,
      arabicKey  : language.arabic,
      isActive   : language.is_active,
    });

    this.languageId = language.id;
    $("#languageModal").modal("show");
  }

  /**
   * Close Language modal
   */
  closeLanguageModal() {
    this.languageForm.reset();
		$("#languageModal").modal("hide");
  }

  /**
   * Add/Update language string
   */
  updateLanguage() {
    this.languageFormSubmitted = true;

    if (this.languageForm.valid) {

      let formValues = this.languageForm.value;

      let formData = <any> {
        id       : this.languageId,
        arabic   : formValues.arabicKey,
        english  : formValues.englishKey,
        is_active: +formValues.isActive,
      };

      let urldata = {
        url: 'admin/language'
      }

      this.commonService.httpCallPut(urldata, formData)
      .subscribe(data => {
        if (data.status === environment.HTTP_STATUS_OK || data.status === environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(data.message, 'success', 'Success');
          this.getLanguages();
          this.closeLanguageModal();
        } else {
          this.commonService.commonToastrMessage(data.message, 'error', 'Error')
        }
      });
    }
  }

  get formControls() {
    return this.languageForm.controls;
  }

}
