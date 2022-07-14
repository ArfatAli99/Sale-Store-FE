import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonserviceService } from '../../../../commonservice.service';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-add-edit-stage',
  templateUrl: './add-edit-stage.component.html',
  styleUrls: ['./add-edit-stage.component.scss']
})
export class AddEditStageComponent implements OnInit {

  // Stage Form Settings
  stageDetailsForm: FormGroup;
  stageStatuses = [
    'In Tendering',
    'On Track',
    'In Delay',
    'Completed',
  ];
  stageCardTitle: string = 'Add Stage';
  stageSubmitBtnText:string = 'Create Stage';
  stageFormSubmitted: boolean = false;

  // Project Details
  projectId: number;
  projectStatus: number = 0;

  // Stage Details
  stageId: number;
  projects: any[] = [];
  projectTasks: any[] = [];

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
  // taskTypesArabic = [
  //   'طلب التفتيش',
  //   'دفع الفاتورة',
  //   'طلب موافقة العميل',
  //   'طلب مخصص',
  //   'قلق الجودة',
  //   'ترتيب التغيير - إضافة النطاق',
  //   'ترتيب التغيير - نطاق الإزالة',
  //   'مطالبة المقاول'
  // ];
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
  editingTaskIndex: number;
  taskBtnText: string = 'Add Task';

  pageState: number;
  defaultStages: any = [];
  isDefaultStage: boolean = false;
  canCreateTasks: boolean = false;

  // Task Template form settings
  taskTemplateForm: FormGroup;
  taskTemplateFormSubmitted: boolean = false;
  taskTemplateItems = [];
  autocompleteTaskTemplateItems = [];

  taskDropdown: any = "";

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private router: Router,
  ) {
    this.defaultStages = this.commonService.defaultStages;
  }

  ngOnInit() {
    this.generateStageForm();
    this.generateTaskForm();
    this.generateTaskTemplateForm();
    this.getTaskTemplateItems();

    this.projectId = +this.route.snapshot.paramMap.get('project_id');
    this.stageId = +this.route.snapshot.paramMap.get('id');
    this.pageState = history.state['page'] ? history.state['page'] : 1;

		if (this.stageId) {
      this.stageCardTitle = 'Edit Stage';
      this.stageSubmitBtnText = 'Save Stage';
      this.getProjectDetails();
      this.getStageDetails();
		}
  }

  /**
   * Get project details
   */
  getProjectDetails() {
    let urlData = {
      url: 'admin/project-details?project_id=' + this.projectId,
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        let response = resp.project_details.rows[0];

        if (response) {
          this.projectStatus = response.status;
        }
      }
    });
  }

  /**
   * Generate Stage Details Form
   */
  generateStageForm() {
    this.stageDetailsForm = this.fb.group({
      // project                    : new FormControl('', [Validators.required]),
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
   * Save stage
   */
  saveStage() {
    this.stageFormSubmitted = true;

    if (this.stageDetailsForm.valid) {
      let url = 'admin/project-stage';
      let method_name = 'httpCallPost';
      let formValues = this.stageDetailsForm.value;

      let formData = <any> {
        project_id                : this.projectId,
        name                      : formValues.stageName,
        description               : formValues.stageDescription,
        description_arabic        : formValues.stageDescriptionArabic,
        sequence                  : formValues.sequenceNo,
        maximum_allowed_percentage: formValues.maximumAllowedOmrPercentage,
        status                    : formValues.stageStatus,
        max_allow_pullback        : formValues.maximumAllowedPullbackStage
      };

      if (this.stageId) {
        url = 'admin/update-stage';
        method_name = 'httpCallPut';
        formData.id = this.stageId;
      }

      let urlData = {
        url: url
      };

      this.commonService[method_name](urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_CREATED) {
          if (! this.stageId) {
            this.stageId = resp.data.id;
          }

          this.stageCardTitle = 'Edit Stage';
          this.stageSubmitBtnText = 'Update Stage';
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getStageDetails();
          // this.router.navigate(['/projects/edit', this.projectId]);
          this.router.navigate(['/project-stages/edit', this.projectId, this.stageId]);
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      })
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
   * Get Stage Details
   */
  getStageDetails() {
    let urlData = {
      url: 'admin/stage'
    };

    let formData = {
      id: this.stageId
    };

    this.commonService.httpCallPost(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        let response = resp.data.rows[0];

        // Set Stage Data
        this.stageDetailsForm.patchValue({
          // project                    : response.project_id,
          stageName                  : response.name,
          stageDescription           : response.description,
          stageDescriptionArabic     : response.description_arabic,
          sequenceNo                 : response.sequence,
          maximumAllowedOmrPercentage: response.maximum_allowed_percentage,
          stageStatus                : response.status,
          maximumAllowedPullbackStage: response.max_allow_pullback,
        });

        this.isDefaultStage = response.is_default;
        this.canCreateTasks = !!( !response.is_default);

        // allow tasks for stage name 'maintenance'
        if (response.name == 'maintenance') {
          this.canCreateTasks = true;
        }

        if (this.isDefaultStage) {
          this.stageDetailsForm.controls['stageName'].disable();
          this.stageDetailsForm.controls['sequenceNo'].disable();
          this.stageDetailsForm.controls['stageStatus'].disable();
          this.stageDetailsForm.controls['maximumAllowedPullbackStage'].disable();
        }

        // Set Task Data
        this.projectTasks = response.project_tasks.map(task => ({
          id                : task.id,
          name              : task.name,
          name_arabic       : task.name_arabic,
          status            : task.status,
          type              : task.type,
          type_arabic       : task.type_arabic,
          instruction       : task.instruction,
          instruction_arabic: task.instruction_arabic,
          creator           : 'User',
          assignee          : task.assignee,
          is_deleted        : 0
        }));
      }
    }, error => {
      this.commonService.log(error);
    });
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
    this.editingTaskIndex = null;

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
        let task = this.projectTasks[this.editingTaskIndex];
        data.id = task.id;
        this.projectTasks[this.editingTaskIndex] = data;
      } else {
        if (this.taskForm.valid) {
          this.projectTasks.push(data);
        }
      }

      this.saveAllTasks();
      this.closeTaskModal();
    }
  }

  /**
   * Save All Tasks
   */
  saveAllTasks() {
    // console.log(this.projectTasks);
    let urlData = {
      url: 'admin/project-task'
    };

    let formData = {
      stage_id: this.stageId,
      data: this.projectTasks
    };

    this.commonService.httpCallPut(urlData, formData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
        this.getStageDetails();
        // this.router.navigate(['/projects/edit', this.projectId]);
      } else {
        this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      }
    }, error => {
      this.commonService.log(error);
    });
  }

  /**
   * Edit Task
   * @param index Integer
   */
  editTask(index: number) {
    let task = this.projectTasks[index];
    this.editingTask = true;
    this.taskBtnText = 'Update Task';
    this.editingTaskIndex = index;

    this.taskForm.patchValue({
      taskName             : task.name,
      taskNameArabic       : task.name_arabic,
      taskStatus           : task.status,
      taskType             : task.type,
      taskTypeArabic       : task.type_arabic,
      taskInstruction      : task.instruction,
      taskInstructionArabic: task.instruction_arabic,
      assignee             : task.assignee,
    });

    this.openTaskModal();
  }

  confirmDeleteTask(index) {
    let msg = 'Do you want to delete this task?';
    this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '', index);
  }

  /**
   * Delete Task
   * @param index Integer
   */
  deleteTask(index: number) {
    this.projectTasks[index].is_deleted = 1;
    this.saveAllTasks();
  }

  /**
  * Go back to previous page
  */
  goBack(): void {
    this.router.navigateByUrl('/project-stages', { state: { pageState: this.pageState } });
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
		cancel_btn_txt: string, confirm_btn_txt: string, outsite_clickable: any, msg: string, index) {

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
				this.deleteTask(index);
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
  openTaskTemplate() {
    $("#taskTemplateModal").modal("show");   
  }

  /**
   * Close Task Template Modal
   */
  closeTaskTemplateModal() {
    this.taskTemplateForm.reset();
    this.taskTemplateFormSubmitted = false;

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
        url: 'admin/import-task'
      };
  
      let formData = {
        stage_id: this.stageId,
        template_id: parseInt( formValues.taskTemplate )
      };

      // console.log(formData); return;

      this.commonService.httpCallPost(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getStageDetails();
          this.closeTaskTemplateModal();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });      
    }
  }

  importTask() {
    if (this.taskDropdown) {
      let urlData = {
        url: 'admin/import-task'
      };
  
      let formData = {
        stage_id: this.stageId,
        task_id: parseInt( this.taskDropdown )
      };

      // console.log(formData); return;

      this.commonService.httpCallPost(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getStageDetails();
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
