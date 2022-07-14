import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { CommonserviceService } from '../../../commonservice.service';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../_services/notification.service';
import { switchMap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('projectDoc') projectDoc: ElementRef;

  @ViewChild('fileField') fileField: ElementRef;
  fileToUpload;
  fileType:string;
  projectDrawing: boolean = false;
  legalDocument:boolean=false;
  fileUploadType: any;

  drawingTags = [
  {tag_name: 'Architectural'},
  {tag_name: 'Structural'},
  {tag_name: 'Electrical'},
  {tag_name: 'Plumbing'},
  {tag_name: 'External 3D Renders'}
];

  documentTags = [
    {tag_name: 'MOH Property Ownership (Mulkiya)'},
    {tag_name: 'MOH Plot Layout (Krookie)'},
    {tag_name: 'Municipality Building Permit (Ibaha)'}
  ];


  projectId: number;
  pageState: number;
  cardTitle: string;
  submitBtnText: string;
  projectDetailsForm: FormGroup;
  projectStatus: number;
  projectScopes: any = [];
  projectDocs: any = [];
  projectStages: any = [];
  clientDetails: any;
  contractorDetails: any;
  consultantDetails: any;

  // Template Import Form
  templateImportForm: FormGroup;
  importTemplateFormSubmitted: boolean = false;
  stageTemplates: any[] = [];

  // Save Template Form
  saveTemplateForm: FormGroup;
  saveTemplateFormSubmitted: boolean = false;

  baseImageUrl = environment.upload_url;

  projectStatuses = [];

  projectDetailsFormSubmitted: boolean = false;
  projectLocations = [
    'Muscat',
    'Al Batinah South',
    'Al Batinah North',
    'Ad Dhahirah',
    'Ad Dhakhiliyah',
    'Ash Sharqiyah South',
    'Ash Sharqiyah North',
    'Al Buraimi',
    'Al Wusta',
    'Dhofar',
    'Musandam'
  ];

  projectLocationsInArabic = [
    'مسقط',
    'مسندم',
    'ظفار',
    'جنوب الشرقية',
    'شمال الشرقية',
    'الوسطى',
    'البريمي',
    'الباطنة الجنوبية',
    'شمال الباطنة',
    'الظاهرة',
    'الداخلية'
  ];

  apiProjectDetails: any;
  activeFileIndex: number;

  submittedFormLanguage = 'en';

  public landSerialMask = [/[1-9]/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  supplyAndInstallByContractorScope = [];
  supplyAndInstallByClientScope = [];
  suppliedByClientAndInstalledByContractorScope = [];

  projectSignedByBoth: boolean = false;
  contractLanguage: string = "";

  projectBids: any = [];

  // Doc Tags Form Settings
  changeDocTagsForm: FormGroup;
  docTags: any = [];
  selectedDocTags: any = [];
  saveDocTagsFormSubmitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private notificationService: NotificationService,
  ) {
   this.projectStatuses = this.commonService.getProjectStatuses();
  }

  ngOnInit() {
    this.generateForm();
    this.generateImportTemplateForm();
    this.generateSaveTemplateForm();
    this.getTemplates();
    this.generateDocTagsForm();


    this.projectId = +this.route.snapshot.paramMap.get('id');
    this.pageState = history.state['page'] ? history.state['page'] : 1;

		if (this.projectId) {
      this.cardTitle = 'Project Details';
      this.submitBtnText = 'Save Changes';
			this.getProjectDetails();
      this.getClientDetails();
      this.getProjectBids();
    }
  }



  selectFile(type) {
    this.fileUploadType = type;
    this.fileField.nativeElement.click();
  }



  postMethodFile(event: any) {
    const  file = event.target.files[0];

    console.log(file);
    const formData = new FormData();
    formData.append('image', file);
    console.log(formData);


    const urlData = {
      url: `client/project-doc`,
    };
   console.log(formData);

    this.commonService.httpCallPostformdata(urlData, formData)
    .pipe(
        switchMap( resp => {
            let payload = [];
        if (this.fileUploadType === 'drawing') {
              payload =  [
                    {
                    type: this.fileUploadType,
                    resource_type: resp.data.resource_type,
                    resource_url: resp.data.resource_url,
                    tags: this.drawingTags
                    }
                  ];
                }  else {
                     payload = [
                        {
                        type: this.fileUploadType,
                        resource_type: resp.data.resource_type,
                        resource_url: resp.data.resource_url,
                        tags: this.documentTags
                        }
                      ]
                    }
          const urlDataDoc = {
            url: 'admin/project-doc-upload',
          };
          const formPayload = new HttpParams()
          .set('project_docs_and_tags', JSON.stringify(payload))
          .set('project_id', this.projectId.toString());
          return this.commonService.httpCallPostFormurlEncoded(urlDataDoc, formPayload);
        })
      )
    .subscribe(resp => {
        if (resp.status == environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getProjectDetails();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });
  }




  /**
   * Get all saved templates
   */
  getTemplates() {
		let urlData = {
			url: 'admin/project-template',
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        this.stageTemplates = resp.data.rows.filter(row => row.is_active === 1).map(row => ({
          id  : row.id,
          name: row.name
        }));
      }
    });
  }



  /**
   * Generate project details form
   */
  generateForm() {
    this.projectDetailsForm = this.fb.group({
      projectName     : new FormControl({value: '', disabled: true}, [Validators.required]),
      projectLocation : new FormControl({value: '', disabled: true}, [Validators.required]),
      projectUse      : new FormControl({value: '', disabled: true}, [Validators.required]),
      plotArea        : new FormControl({value: '', disabled: true}, [Validators.required]),
      builtUpArea     : new FormControl({value: '', disabled: true}, [Validators.required]),
      basement        : new FormControl({value: '', disabled: true}, [Validators.required]),
      levellingFloor  : new FormControl({value: '', disabled: true}, [Validators.required]),
      goundFloor      : new FormControl({value: '', disabled: true}, [Validators.required]),
      additionalFloors: new FormControl({value: '', disabled: true}, [Validators.required]),
      pentFloor       : new FormControl({value: '', disabled: true}, [Validators.required]),
      isAllDrawing    : new FormControl({value: '', disabled: true}, [Validators.required]),
      clarification   : new FormControl({value: '', disabled: true}, []),
      landSerialNumber: new FormControl({value: '', disabled: true}, [Validators.required]),
      ownerNationalId : new FormControl({value: '', disabled: true}, [Validators.required]),
      specialRequest  : new FormControl({value: '', disabled: true}, [Validators.required]),
      isUserOwner     : new FormControl({value: '', disabled: true}),
      callBackDate    : new FormControl({value: '', disabled: false}, [Validators.required]),
      colorTag        : new FormControl({value: '', disabled: false}, [Validators.required]),
      notes           : new FormControl({value: '', disabled: false}, []),
    });
  }

  /**
   * getting details for client and contractor
   */

    getClientDetails() {
      const urlData = {
        url: `admin/project?project_id=${this.projectId}`,
      };
      this.commonService.httpCallGet(urlData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_OK) {
            this.clientDetails = resp.data.rows[0].user;
            this.contractorDetails = resp.data.rows[0].project_bids[0];
            this.consultantDetails = resp.data.rows[0].project_consultants[0];
            this.projectSignedByBoth = resp.data.rows[0].sign_complete;
            // console.log(this.clientDetails, this.contractorDetails);
          }
        }, error => {
          this.commonService.log(error);
        });
    }

  /**
   * Get project details
   */
  getProjectDetails() {
    let urlData = {
      url: 'admin/project-details?project_id=' + this.projectId,
    };

    // let postData = {
    //   project_id: this.projectId,
    // };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        let response;
        let projectDetails = resp.project_details.rows[0];

        if (projectDetails) {
          this.projectStatus = projectDetails.status;
          // this.apiProjectDetails = response;
          this.apiProjectDetails = projectDetails;

          if (! /[a-zA-Z]/.test(projectDetails.project_location)) {
            this.submittedFormLanguage = 'ara';
          }

          this.projectDetailsForm.patchValue({
            projectName     : projectDetails.name,
            projectLocation : projectDetails.project_location,
            projectUse      : projectDetails.project_use_type,
            plotArea        : projectDetails.plot_area,
            builtUpArea     : projectDetails.built_up_area,
            basement        : projectDetails.basement,
            levellingFloor  : projectDetails.levelling_floor,
            goundFloor      : projectDetails.gound_floor,
            additionalFloors: projectDetails.additional_floors,
            pentFloor       : projectDetails.pent_floor,
            isUserOwner     : projectDetails.is_user_owner,
            isAllDrawing    : projectDetails.is_all_drawing,
            clarification   : projectDetails.is_drawing_available_comment,
            landSerialNumber: projectDetails.land_serial_no,
            ownerNationalId : projectDetails.national_id,
            specialRequest  : projectDetails.special_request,
            callBackDate    : new Date(projectDetails.notes[0] ? projectDetails.notes[0].callback_date : ''),
            colorTag        : projectDetails.notes[0] ? projectDetails.notes[0].color_tag : '',
            notes           : projectDetails.notes[0] ? projectDetails.notes[0].notes_holder : '',
          });

          this.projectScopes = projectDetails.project_metas;
          this.projectStages = [];

          if (this.projectStatus > 0) {
            // Stage: Initial Payment
            if (resp.data[0].name == 'primary_payment') {
              this.projectStages.push(resp.data[0]);
            } else if (resp.data[2].name == 'primary_payment') {
              this.projectStages.push(resp.data[2]);
            }

            // Add custom stages
            let custom_stages = [];
            if (resp.data[1].rows.length) {
              resp.data[1].rows[0].project_stages.map(stage => {
                // this.projectStages.push(stage);
                custom_stages.push(stage);
              });
            }

            // sorting by sequence no
            if (custom_stages.length) {
              custom_stages.sort(function(a, b) {
                return a.sequence - b.sequence;
              });
              this.projectStages.push(...custom_stages);
            }

            // Stage: Maintenance
            if (resp.data[0].name == 'maintenance') {
              this.projectStages.push(resp.data[0]);
            } else if (resp.data[2].name == 'maintenance') {
              this.projectStages.push(resp.data[2]);
            }
          }

          this.projectDocs = [];

          projectDetails.project_docs
          .filter(doc => ["drawing", "document", "other"].includes(doc.type))
          .map(doc => {
            let docTags = doc.tags.map(tag => tag.tag_name).join(", ");

            if (doc.type == "other") {
              docTags = ["Others"];
            }

            let docInfo = {
              id: doc.id,
              type: doc.type,
              resource_url: doc.resource_url,
              tags: docTags
            };

            this.projectDocs.push(docInfo);
          });

          // Enable form fields when project status is pending
          if (this.projectStatus == 1) {
            this.projectDetailsForm.controls['projectName'].enable();
            this.projectDetailsForm.controls['projectLocation'].enable();
            this.projectDetailsForm.controls['projectUse'].enable();
            this.projectDetailsForm.controls['plotArea'].enable();
            this.projectDetailsForm.controls['builtUpArea'].enable();
            this.projectDetailsForm.controls['basement'].enable();
            this.projectDetailsForm.controls['levellingFloor'].enable();
            this.projectDetailsForm.controls['goundFloor'].enable();
            this.projectDetailsForm.controls['additionalFloors'].enable();
            this.projectDetailsForm.controls['pentFloor'].enable();
            this.projectDetailsForm.controls['isAllDrawing'].enable();
            this.projectDetailsForm.controls['clarification'].enable();
            this.projectDetailsForm.controls['landSerialNumber'].enable();
            this.projectDetailsForm.controls['ownerNationalId'].enable();
            this.projectDetailsForm.controls['specialRequest'].enable();
            this.projectDetailsForm.controls['callBackDate'].enable();
            this.projectDetailsForm.controls['colorTag'].enable();

            if (projectDetails.is_all_drawing == 0) {
              this.projectDetailsForm.controls['clarification'].setValidators([Validators.required]);
              this.projectDetailsForm.controls['clarification'].updateValueAndValidity();
            }
          }

          // Setup scopes
          let filtered_scopes = this.projectScopes.filter(scope => scope.q_result != "0");
          this.supplyAndInstallByContractorScope = [];
          this.supplyAndInstallByClientScope = [];
          this.suppliedByClientAndInstalledByContractorScope = [];

          for (const item of filtered_scopes) {
            if (item.supplied_by == 3 && item.installed_by == 3) {
              this.supplyAndInstallByContractorScope.push(item);
            }

            if (item.supplied_by == 1 && item.installed_by == 1) {
              this.supplyAndInstallByClientScope.push(item);
            }

            if (item.supplied_by == 1 && item.installed_by == 3) {
              this.suppliedByClientAndInstalledByContractorScope.push(item);
            }



            if (item.supplied_by == 2 && item.installed_by == 2) {
              this.supplyAndInstallByContractorScope.push(item);
            }
            if (item.supplied_by == 1 && item.installed_by == 2) {
              this.suppliedByClientAndInstalledByContractorScope.push(item);
            }
          }

          // for (const item of filtered_scopes) {
          //   if (item.supplied_by == 3 && item.installed_by == 3 && item.q_result == 1) {
          //     this.supplyAndInstallByContractorScope.push(item);
          //   }
          // }

        }
      }
    });
  }

  /**
   * Get User Type
   * @param typeId Integer
   */
  getUserType(typeId) {
    switch(typeId) {
      case 1:
        return 'Client';

      case 2:
        return 'Consultant';

      case 3:
        return 'Contractor';

      default:
        return '';
    }
  }

  /**
   * Replace hyphen with space
   * @param name String
   */
  formatScopeGroupName(name: string) {
    if (name.length === 0) {
      return ' ';
    }

    return name.replace(/_/g, ' ');
  }

  /**
   * Open save template modal
   */
  openSaveTemplateModal() {
    $("#saveTemplateModal").modal("show");
  }

  /**
   * Close save template modal
   */
  closeSaveTemplateModal() {
    this.saveTemplateForm.reset();
		$("#saveTemplateModal").modal("hide");
  }


  /**
   * Open stage template modal
   */
  openStageTemplateModal() {
    $("#templateModal").modal("show");
  }

  /**
   * Close stage template modal
   */
  closeTemplateModal() {
    this.templateImportForm.reset();
		$("#templateModal").modal("hide");
  }

  /**
   * Save stages as template
   */
  saveAsTemplate() {
    this.saveTemplateFormSubmitted = true;
    let stages = [];
    let tasks = [];

    if (this.saveTemplateForm.valid) {
      console.log(this.projectStages);
      // return;

      this.projectStages.forEach((stage:any) => {
        tasks = [];

        // Adding Tasks
        stage.project_tasks.forEach((task: any) => {
          tasks.push({
            stage_id          : stage.id,
            task_name         : task.name,
            task_name_arabic  : task.name_arabic,
            status            : task.status,
            Type              : task.type,
            type_arabic       : task.type_arabic,
            Instruction       : task.instruction,
            Instruction_arabic: task.instruction_arabic,
            creator           : task.creator,
            assignee          : task.assignee
          });
        });

        // Adding Stages
        stages.push({
          name                      : stage.name,
          description               : stage.description,
          maximum_allowed_percentage: stage.maximum_allowed_percentage,
          max_allow_pullback        : stage.max_allow_pullback,
          sequence                  : stage.sequence,
          is_default                : stage.is_default,
          description_arabic        : stage.description_arabic,
          task_data                 : tasks
        });
      });

      // Submit Data
      let urlData = {
        url: 'admin/add-template'
      };

      let formData = {
        name: this.saveTemplateForm.value.templateName,
        stage_data: stages,
        // task_data: tasks
      };

      this.commonService.httpCallPost(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.closeSaveTemplateModal();
          this.getTemplates();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });
    }
  }

  /**
   * Import stages from a template
   */
  importTemplate() {
    this.importTemplateFormSubmitted = true;

    if (this.templateImportForm.valid) {
      //Submit Data
      let urlData = {
        url: 'admin/import-stage'
      };

      let formData = <any> {
        template_id     : this.templateImportForm.value.template,
        project_id      : this.projectId,

      };

      this.commonService.httpCallPost(urlData, formData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_CREATED) {
          this.closeTemplateModal();
          this.getProjectDetails();
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
        } else {
          this.closeTemplateModal();
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => {
        this.commonService.log(error);
      });
    }
  }

  /**
   * Generate Import Template Form
   */
  generateImportTemplateForm() {
    this.templateImportForm = this.fb.group({
      template: new FormControl('', [Validators.required])
    });
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
  get importTemplateFormControls() {
    return this.templateImportForm.controls;
  }

  /**
   * Get Save Template Form Controls
   */
  get saveTemplateFormControls() {
    return this.saveTemplateForm.controls;
  }

	/**
	 * Get project status
	 * @param projectStatus Integer
	 */
	getProjectStatus(projectStatus: number) {
		return this.projectStatuses[projectStatus];
  }

  /**
   * Set project status to active
   */
  setProjectActive() {
    let max_percentage = 0;

    this.projectStages.map(stage => max_percentage += stage.maximum_allowed_percentage);

    if (this.projectStages.length <= 2) {
      this.commonService.commonToastrMessage('Please create some stages first!', 'error', 'Error');
    } else if (max_percentage < 100) {
      this.commonService.commonToastrMessage('Sum of Maximum Allowed Percentage should be 100!', 'error', 'Error');
    } else {
      let msg = 'Do you want to approve this project?';
      this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '');
    }
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
		cancel_btn_txt: string, confirm_btn_txt: string, outsite_clickable: any, msg: string) {

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
				this.changeProjectStatus(this.projectId);
			}
		});
  }

/**
	 * Change project status
	 * @param projectId Integer
	 */
	changeProjectStatus(projectId) {

		let urldata = {
			url: 'admin/project-status-change'
		};

		var formData = {
			project_id: projectId,
			status: 2,
		};

		this.commonService.httpCallPut(urldata, formData)
		.subscribe(resp => {
			if (resp.status === environment.HTTP_STATUS_CREATED) {
        this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
        this.getProjectDetails();

					// Emit Notification
					this.notificationService.sendMessage({
						"notification_from" : 0,
						"notification_to"   : this.apiProjectDetails.user_id,
						"project_id"        : projectId,
						"title"             : "Your project has been approved by admin",
						"description"       : "",
						"title_arabic"      : "وافق المشرف على مشروعك",
						"description_arabic": "",
						"type"              : "both"
					});
			} else {
				this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
			}
		}, error => {
			this.commonService.log(error);
		});
	}

  /**
  * Download project scope
  */
  downloadScope() {
    let urlData = {
      url: 'client/scope-pdf?project_id=' + this.projectId,
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        let file = resp.resp;

        if (file) {
          window.open(environment.upload_url + file, '_blank');
        }
      } else {
        this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      }
    }, error => {
      this.commonService.log(error);
    });
  }

  /**
   * Return project details form controls
   */
  get projectDetailsFormControls() {
    return this.projectDetailsForm.controls;
  }

  /**
   * Update project details
   */
  updateProjectDetails() {
    this.projectDetailsFormSubmitted = true;

    if (this.projectDetailsForm.valid) {
      let formValues = this.projectDetailsForm.value;

      this.apiProjectDetails.name                         = formValues.projectName;
      this.apiProjectDetails.project_location             = formValues.projectLocation;
      this.apiProjectDetails.project_use_type             = formValues.projectUse;
      this.apiProjectDetails.plot_area                    = formValues.plotArea;
      this.apiProjectDetails.built_up_area                = formValues.builtUpArea;
      this.apiProjectDetails.basement                     = formValues.basement;
      this.apiProjectDetails.levelling_floor              = formValues.levellingFloor;
      this.apiProjectDetails.gound_floor                  = formValues.goundFloor;
      this.apiProjectDetails.additional_floors            = formValues.additionalFloors;
      this.apiProjectDetails.pent_floor                   = formValues.pentFloor;
      this.apiProjectDetails.is_all_drawing               = formValues.isAllDrawing;
      this.apiProjectDetails.is_drawing_available_comment = formValues.clarification;
      this.apiProjectDetails.land_serial_no               = formValues.landSerialNumber;
      this.apiProjectDetails.national_id                  = formValues.ownerNationalId;
      this.apiProjectDetails.special_request              = formValues.specialRequest;
      this.apiProjectDetails.call_back_date               = formValues.callBackDate;
      this.apiProjectDetails.color_tag                    = formValues.colorTag;
      this.apiProjectDetails.notes                        = formValues.notes;

      this.updateProjectData();

      // let urldata = {
      //   url: 'admin/project'
      // }

      // let postData = {
      //   id: this.projectId,
      //   name: formValues.projectName,
      //   project_location: formValues.projectLocation,
      //   project_use_type: formValues.projectUse,
      //   plot_area: formValues.plotArea,
      //   built_up_area: formValues.builtUpArea,
      //   basement: formValues.basement,
      //   levelling_floor: formValues.levellingFloor,
      //   gound_floor: formValues.goundFloor,
      //   additional_floors: formValues.additionalFloors,
      //   pent_floor: formValues.pentFloor,
      // };

      // this.commonService.httpCallPut(urldata, postData)
      // .subscribe(resp => {
      //   if (resp.status === environment.HTTP_STATUS_OK) {
      //     this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
      //   } else {
      //     this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      //   }
      // }, error => this.commonService.log(error));
    }
  }

  /**
   * Select a new file
   *
   * @param index Integer
   */
  chooseDocFile(index: number) {
    this.activeFileIndex = index;
    this.projectDoc.nativeElement.click();
  }

  /**
   * Change project doc
   *
   * @param files File
   */
  changeDoc(files: FileList) { console.log("called");
    const file = files.item(0);

    if (!file) {
      return;
    }

    if (file.size > (25 * 1024 * 1024)) {
      this.commonService.commonToastrMessage('File size should be less than 25 mb!', 'error', 'Error');
      return;
    }

    Swal.fire({
      title: 'Are you sure to change this file?',
      text: 'Existing file will be overridden.',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          let urlData = {
            url: 'admin/project-doc'
          }

          let formData = new FormData();
          formData.append("image", file);

          this.commonService.httpCallPostformdata(urlData, formData)
          .subscribe(resp => {
            resolve(resp);
          }, error => this.commonService.log(error));
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        let resp = result.value;

        if (resp.status === environment.HTTP_STATUS_CREATED) {
          this.apiProjectDetails.project_docs[this.activeFileIndex].resource_type = resp.data.resource_type;
          this.apiProjectDetails.project_docs[this.activeFileIndex].resource_type = resp.data.resource_type;
          this.apiProjectDetails.project_docs[this.activeFileIndex].resource_url = resp.data.resource_url;

          // this.commonService.commonToastrMessage('File has been modified. Please click the save changes button.', 'success', 'Success');
          this.updateProjectData();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }
    });
  }

  /**
   * Update whole project data
   */
  updateProjectData() {
    let urlData = {
      url: 'admin/project'
    };

    let postData = {
      'id'                          : this.projectId,
      'name'                        : this.apiProjectDetails.name,
      'project_location'            : this.apiProjectDetails.project_location,
      'project_use_type'            : this.apiProjectDetails.project_use_type,
      'plot_area'                   : this.apiProjectDetails.plot_area,
      'built_up_area'               : this.apiProjectDetails.built_up_area,
      'basement'                    : this.apiProjectDetails.basement,
      'levelling_floor'             : this.apiProjectDetails.levelling_floor,
      'gound_floor'                 : this.apiProjectDetails.gound_floor,
      'additional_floors'           : this.apiProjectDetails.additional_floors,
      'pent_floor'                  : this.apiProjectDetails.pent_floor,
      'is_user_owner'               : this.apiProjectDetails.is_user_owner,
      'is_all_drawing'              : this.apiProjectDetails.is_all_drawing,
      'is_drawing_available_comment': this.apiProjectDetails.is_drawing_available_comment,
      'land_serial_no'              : this.apiProjectDetails.land_serial_no,
      'national_id'                 : this.apiProjectDetails.national_id,
      'special_request'             : this.apiProjectDetails.special_request,
      'call_back_date'              : this.apiProjectDetails.call_back_date,
      'color_tag'                   : this.apiProjectDetails.color_tag,
      'notes'                       : this.apiProjectDetails.notes,
      'current_state'               : 1,
      'status'                      : 1,
      'is_consultant'               : 0,
      'project_meta'                : JSON.stringify(this.apiProjectDetails.project_metas),
      'project_docs_and_tags'       : JSON.stringify(this.apiProjectDetails.project_docs.filter(doc => doc.resource_type != 'zip'))
    };

    // this.commonService.log(postData);
    // return;

    this.commonService.httpCallPut(urlData, postData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
        this.getProjectDetails();
      } else {
        this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      }
    }, error => this.commonService.log(error));
  }





  toggleDrawing() {
    let newValue = ! this.apiProjectDetails.is_all_drawing;
    this.apiProjectDetails.is_all_drawing = newValue;

    if (newValue) {
      this.projectDetailsForm.controls['clarification'].setValidators(null);
    } else {
      this.projectDetailsForm.controls['clarification'].setValidators([Validators.required]);
    }

    this.projectDetailsForm.controls['clarification'].updateValueAndValidity();
  }

  /**
   * Delete project stage
   */
  deleteStage(projectId: number, stageId: number) {
    Swal.fire({
      title: '',
      text: 'Are you sure to delete this stage?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          let urlData = {
            url: 'admin/stage-status'
          }

          let formData = {
            id: stageId
          }

          this.commonService.httpCallPut(urlData, formData)
          .subscribe(resp => {
            resolve(resp);
          }, error => this.commonService.log(error));
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        let resp = result.value;

        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getProjectDetails();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }
    });
  }

  /**
   * Update contract language
   */
  selectContractLanguage() {
    if (this.contractLanguage !== "") {
      this.downloadContract(this.contractLanguage);
    }
  }

  /**
   * Download project contract
   * @param language string
   */
  downloadContract(language: string = "en") {
    let params = {
      id: this.contractorDetails.contractor_id,
      project_id: this.projectId,
      lang: language
    };

		let urlData = {
			url: 'admin/contract-pdf?' + this.commonService.convertToUrlParams(params),
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        let file = resp.resp;

        if (file) {
          window.open(environment.upload_url + file, '_blank');
        }
      } else {
        this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      }
      this.contractLanguage = "";
    }, error => {
      this.commonService.log(error);
    });
  }

  /**
   * Get project bids
   */
  getProjectBids() {
    let params = {
      project_id: this.projectId,
    };

		let urlData = {
			url: 'admin/project-bid?' + this.commonService.convertToUrlParams(params),
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.projectBids = resp.data.rows;
      }
    }, error => {
      this.commonService.log(error);
    });
  }

  /**
   * Change doc tags
   * @param docId Integer
   */
  changeDocTags(docId: number) {
    let doc = this.apiProjectDetails.project_docs.find(doc => doc.id == docId);
    this.docTags = doc.type == "drawing" ? this.drawingTags : this.documentTags;
    console.log(doc);
    this.selectedDocTags = doc.tags.map(doc => doc.tag_name.replace(/\s+/g, ' ').trim());
    console.log(this.selectedDocTags);
    this.changeDocTagsForm.patchValue({
      docTag: this.selectedDocTags,
      docId: docId
    });

    $("#saveDocTagsModal").modal("show");
  }



  generateDocTagsForm() {
    this.changeDocTagsForm = this.fb.group({
      docTag: ['', [Validators.required]],
      docId: ['', [Validators.required]],
    });
  }

  get saveDocTagsFormControls() {
    return this.changeDocTagsForm.controls;
  }

  saveDocTags() {
    this.saveDocTagsFormSubmitted = true;

    if (this.changeDocTagsForm.valid) {
      let formValues = this.changeDocTagsForm.value;
      // console.log(formValues); return;

      let urlData = {
        url: 'admin/project-tags-edit'
      }

      let postData = {
        project_doc_id: formValues.docId,
        tags: JSON.stringify(formValues.docTag.map(tag => ({
          tag_name: tag
        })))
      };

      this.commonService.httpCallPost(urlData, postData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.closeDocTagsModal();
          this.getProjectDetails();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }, error => this.commonService.log(error));
    }
  }

  /**
   * Closes tags modal popup
   */
  closeDocTagsModal() {
    this.changeDocTagsForm.reset();
		$("#saveDocTagsModal").modal("hide");
  }

  /**
   * Delete a new file
   *
   * @param docId Integer
   */
  deleteDocFile(docId: number) {
    // console.log("docId", docId); return;

    Swal.fire({
      title: '',
      text: 'Are you sure to delete this file?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          let urlData = {
            url: 'admin/project-doc-delete'
          }

          let formData = {
            id: docId
          }

          this.commonService.httpCallPut(urlData, formData)
          .subscribe(resp => {
            resolve(resp);
          }, error => this.commonService.log(error));
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        let resp = result.value;

        if (resp.status === environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
          this.getProjectDetails();
        } else {
          this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
        }
      }
    });
  }

}
