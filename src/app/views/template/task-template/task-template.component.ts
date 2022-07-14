import { Component, TemplateRef, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { CommonserviceService } from '../../../commonservice.service';
import { PagerService } from '../../../_services/pager.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-template',
  templateUrl: './task-template.component.html',
  styleUrls: ['./task-template.component.scss']
})
export class TaskTemplateComponent implements OnInit {

  taskTemplateDetails = [];
  pageOffset: number = 1;
  countTotalPage: number;
  isPageSetFirstTime: Boolean = false;

  modalRef: BsModalRef;
  message: string;
  selectedTempId: any;
  search_text: string = '';
  limitPerPage = environment.userListLimit;
  pager:any={};

  // Save Template Form
  saveTemplateForm: FormGroup;
  saveTemplateFormSubmitted: boolean = false;

  // Task Form Settings
  taskForm: FormGroup;
  taskStatuses = [
    'In Tendering',
    'On Track',
    'In Delay',
    'Completed'
  ];
  taskTypes = [
    'Inspection Request',
    'Invoice Payment',
    'Client Approval Request',
    'Custom Request',
    'Quality Concern',
    'Variation Order - Adding Scope',
    'Variation Order - Removal Scope',
    'Contractor Claim'
  ];   
  taskTypesArabic = [
    'طلب تفتيش',
    'دفع الفاتورة',
    'طلب موافقة العميل',
    'طلب مخصص',
    'قلق الجودة',
    'ترتيب التغيير - إضافة النطاق',
    'ترتيب التغيير - نطاق الإزالة',
    'مطالبة المقاول'
  ]; 
  taskFormSubmitted: boolean = false;
  editingTask: boolean = false;
  editingTaskData: any;
  taskBtnText: string = 'Add Task';   
  selectedTaskId: number;

  taskTemplateItems = [];
  autocompleteTaskTemplateItems = [];

  constructor(
    private commonService: CommonserviceService,
    private pagerService: PagerService,
    private modalService: BsModalService,
    private fb: FormBuilder,
  ) {

  }
  ngOnInit() {
    this.getTaskTemplatesList();
    this.generateSaveTemplateForm();
    this.generateTaskForm();
    this.getTaskTemplateItems();
  }

  // openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  // }

  // confirm(): void {
  //   this.message = 'Confirmed!';
  //   this.modalRef.hide();
  //   const urlData = {
  //     url: `admin/project-template-task-delete`,
  //   };
  //   const sendData = {
  //     id: this.selectedTempId,
  //   }

  //   this.commonService.httpCallPut(urlData, sendData).subscribe(resp => {
  //     this.getTaskTemplatesList();
  //     this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
  //   }, error => {
  //     console.log('error');
  //   }
  //   );

  // }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  getTaskTemplatesList() {
    const urlData = {
      url: `admin/template-task-view?search_text=${this.search_text}&page=${this.pageOffset}&limit=${this.limitPerPage}`,
    };
    this.commonService.httpCallGet(urlData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.taskTemplateDetails = resp.data.rows;
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
    this.getTaskTemplatesList();
  }

  /**
	 * Set default pagination parameter
	 */
	setDefaultPaginationParameter() {
		this.pageOffset = history.state['pageState'] ? history.state['pageState'] : 1;
		this.countTotalPage = 0;
		this.isPageSetFirstTime = false;
	}

  deleteTaskTemplateList(temp, confirmationModalTemplate) {
    this.selectedTempId = temp.id;
    this.openModal(confirmationModalTemplate);

  }

  /**
 * Clears all
 */
  clearAll() {
    this.search_text = '';
    this.getTaskTemplatesList();
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
    this.getTaskTemplatesList();
  }

  /**
   * Open save template modal
   */
  openTaskTemplateModal() {
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
        url: 'admin/template-task-add'
      };

      let formData = {
        name: this.saveTemplateForm.value.templateName,
      };

      this.commonService.httpCallPost(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.closeSaveTemplateModal();
          this.getTaskTemplatesList();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });
    }
  }  

  /**
   * Generate Stage Details Form
   */
  generateTaskForm() {
    this.taskForm = this.fb.group({
      taskName             : new FormControl('', [Validators.required]),
      taskNameArabic       : new FormControl('', [Validators.required]),
      taskStatus           : new FormControl(1, [Validators.required]),
      taskType             : new FormControl('', [Validators.required]),
      // taskTypeArabic       : new FormControl('', [Validators.required]),
      taskInstruction      : new FormControl('', []),
      taskInstructionArabic: new FormControl('', []),
      assignee             : new FormControl('', [Validators.required]),
    });
  }    

  /**
   * Get task form controls
   */
  get taskFormControls() {
    return this.taskForm.controls;
  }

    
  /**
   * Open task modal
   */
  openTaskModal() {
    $("#taskModal").modal("show");
  }

  /**
   * Close task modal
   */
  closeTaskModal() {
    this.taskForm.reset();

    // For Add Task Form
    this.taskBtnText = 'Add Task';
    this.taskFormSubmitted = false;

    // For Edit Task Form
    this.editingTask = false;
    this.editingTaskData = null;

    $("#taskModal").modal("hide");
    this.taskForm.controls['taskStatus'].setValue(1);
  } 

  /**
   * Add New Task
   */
  addNewTask() {
    this.taskFormSubmitted = true;

    if (this.taskForm.valid) {
      let formValues = this.taskForm.value;
      let item = <any>{
        // template_stage_id :this.detailsId,
        name              : formValues.taskName,
        name_arabic       : formValues.taskNameArabic,
        status            : formValues.taskStatus,
        type              : formValues.taskType,
        type_arabic       : this.taskTypesArabic[this.taskTypes.indexOf(formValues.taskType)],
        instruction       : formValues.taskInstruction,
        instruction_arabic: formValues.taskInstructionArabic,
        creator           : 'User',
        assignee          : formValues.assignee,
        is_deleted        : 0
      };

      if (this.editingTask) {
        let task = this.editingTaskData;
        item.id = task.id;
      }


      let urlData = {
        url: 'admin/project-template-task-add'
      };

      this.commonService.httpCallPost(urlData, {
        data: [item]
      })
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getTaskTemplatesList();
          this.closeTaskModal();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });
    }
  }


  /**
   * Edit task
   * @param stage object
   * @param task object
   */
  editTask(task: any) {
    this.taskBtnText = 'Update Task';
    this.editingTask = true;
    this.editingTaskData = task;


    this.taskForm.patchValue({
      taskName             : task.name,
      taskNameArabic       : task.name_arabic,
      taskStatus           : task.status,
      taskType             : task.Type,
      // taskTypeArabic       : task.Type_arabic,
      taskInstruction      : task.Instruction,
      taskInstructionArabic: task.instruction_arabic,
      assignee             : task.assignee,
    });

    this.openTaskModal();
  }  


  deleteTemplateList(task, confirmationModalTemplate) {
    this.selectedTaskId = task.id;
    this.openModal(confirmationModalTemplate);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    const urlData = {
      url: `admin/task-template-delete`,
    };

    
    const sendData = {
      id: this.selectedTaskId,
    }

    this.commonService.httpCallPut(urlData, sendData).subscribe(resp => {
      this.getTaskTemplatesList();
      this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
    }, error => {
      console.log('error');
    }
    );
  }  

  /**
   * Get Task Template Items 
   */
  getTaskTemplateItems() {
    const urlData = {
      url: `admin/template-task-dropdown`,
    };
    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.taskTemplateItems = resp.data.rows;
      }
    }, error => {
      this.commonService.log(error);
    });    
  }  

  /**
   * Display task template search suggestions
   * @param searchValue string
   */
  openTaskSuggestions(searchValue: string) {
    this.autocompleteTaskTemplateItems = [];

    if (searchValue.length > 0 && !this.editingTask) {
      this.autocompleteTaskTemplateItems = this.taskTemplateItems.filter(task => task.name.toLowerCase().includes(searchValue.toLowerCase()));
    }
  }


  /**
   * Select the task and assign it to form
   * @param task object
   */
  selectTask(task: any) {
    this.taskForm.patchValue({
      taskName             : task.name,
      taskNameArabic       : task.name_arabic,
      taskStatus           : task.status,
      taskType             : task.Type,
      taskTypeArabic       : task.Type_arabic,
      taskInstruction      : task.Instruction,
      taskInstructionArabic: task.instruction_arabic,
      assignee             : task.assignee,
    });    

    this.autocompleteTaskTemplateItems = [];
  }
 
}