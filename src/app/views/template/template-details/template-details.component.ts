import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonserviceService } from '../../../commonservice.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
    selector: 'app-template-details',
    templateUrl: './template-details.component.html',
    styleUrls: ['./template-details.component.scss']
})
export class TemplateDetailsComponent implements OnInit {

    stageDetailsForm :FormGroup;
    detailsFormId: any;

    templateDetails: any;
    stageTaskDetails: any = [];

    pageState: number;

    // Stage Form Settings
    stageStatuses = [
      'In Tendering',
      'On Track',
      'In Delay',
      'Completed',
    ];
    stageCardTitle: string = 'Add Stage';
    stageSubmitBtnText:string = 'Create Stage';
    stageFormSubmitted: boolean = false;
    editingStage: boolean = false;
    editingStageData: any;
    currentStage: any;

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

    // Task Template form settings
    taskTemplateForm: FormGroup;
    taskTemplateFormSubmitted: boolean = false;
    taskTemplateItems = [];

    taskDropdown: any = "";

    constructor(
      private commonService: CommonserviceService,
      private fb:FormBuilder,
      private route: ActivatedRoute,
      private router : Router,
    ) {

     }
  
    ngOnInit() {
      this.detailsFormId = this.route.snapshot.paramMap.get('id');

      if (this.detailsFormId){
          this.getTemplatesDetails();
          this.generateStageForm();
          this.generateTaskForm();
          this.generateTaskTemplateForm();
          this.getTaskTemplateItems();
      }
    }

    /**
     * Get stage task details
     */
    getTemplatesDetails() {
        const urlData = {
          url: `admin/project-template-view`,
        };
        const sendData = {
            id: this.detailsFormId
        };

        this.commonService.httpCallPost(urlData, sendData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_OK) {
            this.templateDetails = resp.data.rows[0];
            this.stageTaskDetails = [];

            // Stage: Initial Payment
            let initialStage = this.templateDetails.project_stage_templates.find(stage => stage.name == "primary_payment");
            this.stageTaskDetails.push(initialStage);

            // Add custom stages
            let custom_stages = this.templateDetails.project_stage_templates.filter(stage => !["primary_payment", "maintenance"].includes(stage.name));            

            // sorting by sequence no
            if (custom_stages.length) {
              custom_stages.sort(function(a, b) {
                return a.sequence - b.sequence;
              });
              this.stageTaskDetails.push(...custom_stages);
            }

            // Stage: Maintenance
            let maintenanceStage = this.templateDetails.project_stage_templates.find(stage => stage.name == "maintenance");
            this.stageTaskDetails.push(maintenanceStage);      
          }
        }, error => {
          this.commonService.log(error);
        });
    }

    /**
     * Generate Stage Details Form
     */
    generateStageForm() {
      this.stageDetailsForm = this.fb.group({
        stageName                  : new FormControl('dummy', [Validators.required]),
        stageStatus                : new FormControl(0, [Validators.required]),
        stageDescription           : new FormControl('', [Validators.required]),
        stageDescriptionArabic     : new FormControl('', [Validators.required]),
        sequenceNo                 : new FormControl('', [Validators.required, Validators.min(1)]),
        maximumAllowedPullbackStage: new FormControl(1, [Validators.required, Validators.min(1)]),
        maximumAllowedOmrPercentage: new FormControl(5, [Validators.required, Validators.max(100), Validators.min(1)]),
      });
    }

    /**
     * Get stage form controls
     */
    get stageFormControls() {
      return this.stageDetailsForm.controls;
    }    

    /**
     * Open stage modal
     */
    openStageModal() {
      $("#stageModal").modal("show");
    }    

    /**
     * Close stage modal
     */
    closeStageModal() {
      this.stageDetailsForm.reset();

      // For Add Stage Form
      this.stageSubmitBtnText = 'Create Stage';
      this.stageFormSubmitted = false;

      // For Edit Stage Form
      this.editingStage = false;
      this.editingStageData = null;

      $("#stageModal").modal("hide");
      this.stageDetailsForm.controls['stageName'].enable();
      this.stageDetailsForm.controls['sequenceNo'].enable();
      this.stageDetailsForm.controls['stageStatus'].enable();
      this.stageDetailsForm.controls['maximumAllowedPullbackStage'].enable();
      this.stageDetailsForm.controls['stageName'].setValue('dummy');
      this.stageDetailsForm.controls['stageStatus'].setValue(0);
      this.stageDetailsForm.controls['maximumAllowedPullbackStage'].setValue(1);
      this.stageDetailsForm.controls['maximumAllowedOmrPercentage'].setValue(5);
    }     

    /**
     * Save stage
     */
    saveStage() {
      this.stageFormSubmitted = true;

      if (this.stageDetailsForm.valid) {
        let url = 'admin/template-stage';
        let method_name = 'httpCallPost';
        let formValues = this.stageDetailsForm.value;

        let formData = <any> {
          project_template_id       : this.detailsFormId,
          name                      : formValues.stageName,
          description               : formValues.stageDescription,
          description_arabic        : formValues.stageDescriptionArabic,
          sequence                  : formValues.sequenceNo,
          maximum_allowed_percentage: formValues.maximumAllowedOmrPercentage,
          status                    : formValues.stageStatus,
          max_allow_pullback        : formValues.maximumAllowedPullbackStage
        };

        if (this.editingStage) {
          url = 'admin/template-stage';
          method_name = 'httpCallPut';
          formData.id = this.editingStageData.id;
        }

        let urlData = {
          url: url
        };

        this.commonService[method_name](urlData, formData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_OK || resp.status === environment.HTTP_STATUS_CREATED) {            
            this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
            this.getTemplatesDetails();
            this.closeStageModal();
          } else {
            this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
          }
        }, error => {
          this.commonService.log(error);
        })
      }
    }    
    
    /**
     * Edit Task
     * @param index Integer
     */
    editStage(stage: any) { console.log("stage", stage);
      this.stageSubmitBtnText = 'Update Stage';
      this.editingStage = true;
      this.editingStageData = stage;

      this.stageDetailsForm.patchValue({
        stageName                  : stage.name,
        stageDescription           : stage.description,
        stageDescriptionArabic     : stage.description_arabic,
        sequenceNo                 : stage.sequence,
        maximumAllowedOmrPercentage: stage.maximum_allowed_percentage,
        stageStatus                : stage.status,
        maximumAllowedPullbackStage: stage.max_allow_pullback,
      });

      if (stage.is_default == 1) {
        this.stageDetailsForm.controls['stageName'].disable();
        this.stageDetailsForm.controls['sequenceNo'].disable();
        this.stageDetailsForm.controls['stageStatus'].disable();
        this.stageDetailsForm.controls['maximumAllowedPullbackStage'].disable();
      }      

      this.openStageModal();
    }

    /**
     * Delete the stage
     * @param stage object
     */
    confirmDeleteStage(stage) {
      let msg = 'Do you want to delete this stage?';
      this.commonSwalAlertStage(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '', stage);
    }

    /**
     * Delete Task
     * @param index Integer
     */
    deleteStage(stage) { 
      let urlData = {
        url: 'admin/template-stage-delete'
      };
  
      let formData = {
        id: stage.id
      };

      this.commonService.httpCallPut(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getTemplatesDetails();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });
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
    openTaskModal(stage) {
      $("#taskModal").modal("show");
      this.currentStage = stage;
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
      this.currentStage = null;

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
        let data = <any> {
          template_stage_id : this.currentStage.id,
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
          data.id = task.id;
        }

        let urlData = {
          url: 'admin/template-task'
        };

        this.commonService.httpCallPost(urlData, {
          data: [data]
        })
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_OK) {
            this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
            this.getTemplatesDetails();
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
    editTask(stage: any, task: any) {
      this.taskBtnText = 'Update Task';
      this.editingTask = true;
      this.editingTaskData = task;
      this.currentStage = stage;


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

      this.openTaskModal(stage);
    }

    /**
     * Delete the task
     * @param task object
     */
    confirmDeleteTask(task) {
      let msg = 'Do you want to delete this task?';
      this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '', task);
    }

    /**
     * Delete Task
     * @param index Integer
     */
    deleteTask(task) {
      let urlData = {
        url: 'admin/template-task-delete'
      };
  
      let formData = {
        id: task.id
      };

      this.commonService.httpCallPut(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getTemplatesDetails();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });
    }    

    goBack(): void{
      this.router.navigateByUrl('/project-template')
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
	 * @param stage
	 */
	commonSwalAlertStage(title_txt: string, alert_type: any, show_cancel_btn: any, show_confirm_btn: any,
		cancel_btn_txt: string, confirm_btn_txt: string, outsite_clickable: any, msg: string, stage) {

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
				this.deleteStage(stage);
			}
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
	 * @param task
	 */
	commonSwalAlert(title_txt: string, alert_type: any, show_cancel_btn: any, show_confirm_btn: any,
		cancel_btn_txt: string, confirm_btn_txt: string, outsite_clickable: any, msg: string, task) {

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
				this.deleteTask(task);
			}
		});
  }    
  
  /**
   * Generate Stage Details Form
   */
  generateTaskTemplateForm() {
    this.taskTemplateForm = this.fb.group({
      taskTemplate: new FormControl('', [Validators.required]),
    });
  }  

  /**
   * Get task form controls
   */
  get taskTemplateFormControls() {
    return this.taskTemplateForm.controls;
  }

  /**
   * Open Task Template
   * @param stage object
   */
  openTaskTemplate(stage: any) {
    $("#taskTemplateModal").modal("show");
    this.currentStage = stage;    
  }

  /**
   * Close Task Template Modal
   */
  closeTaskTemplateModal() {
    this.taskTemplateForm.reset();
    this.taskTemplateFormSubmitted = false;
    this.currentStage = null;

    $("#taskTemplateModal").modal("hide");    
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
   * Import task template
   */
  importTaskTemplate() {
    this.taskTemplateFormSubmitted = true;

    if (this.taskTemplateForm.valid) {
      let formValues = this.taskTemplateForm.value;

      let urlData = {
        url: 'admin/import-task-templte'
      };
  
      let formData = {
        stage_id: this.currentStage.id,
        template_id: parseInt( formValues.taskTemplate )
      };

      // console.log(formData); return;

      this.commonService.httpCallPost(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getTemplatesDetails();
          this.closeTaskTemplateModal();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });      
    }
  }

  importTask(stageId: number) {
    if (this.taskDropdown) {
      let urlData = {
        url: 'admin/import-task-templte'
      };
  
      let formData = {
        stage_id: stageId,
        task_id: parseInt( this.taskDropdown )
      };

      // console.log(formData); return;

      this.commonService.httpCallPost(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getTemplatesDetails();
          this.taskDropdown = "";
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });       
    } else {
      this.commonService.commonToastrMessage("Please select a task first!", 'error', 'Error');
    }
  }

}