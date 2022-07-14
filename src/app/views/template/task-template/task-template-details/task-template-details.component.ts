import { Component, TemplateRef, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonserviceService } from '../../../../commonservice.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpParams } from '@angular/common/http';

declare var $: any;

@Component({
    selector: 'app-task-template-details',
    templateUrl: './task-template-details.component.html',
    styleUrls: ['./task-template-details.component.scss']
})
export class TaskTemplateDetailsComponent implements OnInit {

  detailsId:any;  

  selectedTaskId:any;
  taskDetails:any =[];
  modalRef: BsModalRef;
  message: string;

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
   currentStage:any;

    constructor(
      private commonService: CommonserviceService,
      private fb:FormBuilder,
      private route: ActivatedRoute,
      private router : Router,      
      private modalService: BsModalService,
    ) {

     }
  
    ngOnInit() {
      this.detailsId = this.route.snapshot.paramMap.get('id');

      if (this.detailsId){
        this.getTaskTemplatesList();
        this.generateTaskForm();
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
        taskTypeArabic       : new FormControl('', [Validators.required]),
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
          template_stage_id :this.detailsId,
          name              : formValues.taskName,
          name_arabic       : formValues.taskNameArabic,
          status            : formValues.taskStatus,
          type              : formValues.taskType,
          type_arabic       : formValues.taskTypeArabic,
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
        taskTypeArabic       : task.Type_arabic,
        taskInstruction      : task.Instruction,
        taskInstructionArabic: task.instruction_arabic,
        assignee             : task.assignee,
      });

      this.openTaskModal();
    }

    getTaskTemplatesList() {
      const urlData = {
        url: `admin/template-task-list?template_id=${this.detailsId}`,
      };
      this.commonService.httpCallGet(urlData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_OK) {          
            this.taskDetails=resp.data.rows;            
          }
        }, error => {
          this.commonService.log(error);
        });
    }

    getTemplatesList() {
      const urlData = {
        url: `admin/template-task-id?id=1`,
      };
      this.commonService.httpCallGet(urlData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_OK) {
            console.log(resp);
            
          }
        }, error => {
          this.commonService.log(error);
        });
    }
    

    deleteTemplateList(task, confirmationModalTemplate) {
      this.selectedTaskId = task.id;
      console.log(task);
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
  
    decline(): void {
      this.message = 'Declined!';
      this.modalRef.hide();
    }
  }