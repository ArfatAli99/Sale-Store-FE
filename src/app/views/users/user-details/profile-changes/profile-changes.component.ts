import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import HesGallery from 'hes-gallery';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonserviceService } from '../../../../commonservice.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profile-changes',
  templateUrl: './profile-changes.component.html',
  styleUrls: ['./profile-changes.component.scss']
})
export class ProfileChangesComponent implements OnInit {

  usersDetails: any = [];
  pageState: number;
  slashEye: boolean = false;
  passwordInputType: string = 'password';
  userDetailsForm: FormGroup;
  services: FormArray = <any>[];
  machineries: FormArray = <any>[];
  labours: FormArray = <any>[];
  admin: FormArray = <any>[];
  engg: FormArray = <any>[];
  isLinear = false;
  projectPlanningSoftware:any;
  rentMachinary:any;
  rentMachineryDetails:any;
  rentScaffolds:any;
  rentScaffoldsDetails:any;
  subconstructors:any;
  comments:any;
  Step1: FormGroup;
  Step2: FormGroup;
  Step3: FormGroup;
  Step4: FormGroup;
  Step5: FormGroup;
  Step6: FormGroup;
  Step7: FormGroup;
  workedGovournates1: any = []
  workedGovournates = [
    'Muscat',
    'All Wusta',
    'Musandam',
    'Al Buraymi',
    'Dhofar',
    'Al Batinah South',
    'Ash Sharqiyah South',
    'Al Batunah North',
    'Ash Sharqiyah North',
    'Ad Dhahirah',
    'Ad Dakhiliyah'
  ];

  workedGovournates2 = [
    'Oman Housing Bank',
    'Oman Tender Board',
    'PDO',
    'None of the Above'
  ];

  applicableConstructionActivities = [
    'Concrete & Steel Works',
    'Blockwork & Plastering',
    'Mechanical & Electrical Works',
    'Plumbing Works',
    'Paint Works for Exterior and Interior',
    'Gypsum Works: Drywalls and Ceilings',
    'Joinery Works: Cuboards and Doors',
    'Aluminum Works: Windows and Doors',
    'UPVC Works: Windows and Doors',
    'Soil Testing Lab',
    'Tile Installation: Mechanical Method',
    'Supply of Porceline and Ceramic Tiles',
    'Others'
  ];

  applicableServicesProvidedByContractors = [
    'Shop Drawings Detailing (AutoCAD)',
    'Structural Design',
    'Quantity Survey Services',
    '3D Exterior Design Services',
    'Surveying Team and Kit',
    '3D Interior Design Services',
    'Specification of Materials Advisory',
    'None of the above',
    'Other'
  ];

  stepFiveLabours = [
    'Quantity Surveyor',
    'Carpenter',
    'Foreman',
    'Steel Fixer',
    'Mason',
    'Helper',
    'Plumber',
    'Electrical Technician',
    'Draftsman'
  ];

  stepFiveAdmin = [
    'Admin',
    'Superadmin',
    'PRO'
  ];

  engineerManpower: FormArray;
  labourManpower: FormArray;
  adminManpower: FormArray;
  company_website: string;
  yearsOfExperience: any;
  isCivilEngineer: any;
  city: any;
  companyName: any;
  companyAddress: any;
  headQuaterLocation: any;
  crStartDate: any;
  crExpirationDate: any;
  crNumber: any;
  companyWebsite: any;
  instagramAccount: any;
  linkedInAccount: any;
  twitterAccount: any;
  otherMarketingPlatforms: any;
  otherPrivateAndGovernmentAgencies: any;
  governorateYouWorkAt2: any;
  noOfDeliveredProjects: any;
  largestProjectAwardedValue: any;
  noOfSimultaneousProjects: any;
  chargeForBlackBuilding: any;
  chargeForTurnkeyBuilding: any;
  workFailedReason: any;
  hasJudgementsReason: any;
  qualityManagements: any;
  projectPlanningSoftwareDetails: any;
  manpowerEngineerSpecialization: any;
  manpowerNumberOfOmaniEngineers: any;
  manpowerNumberOfNonOmaniEngineers: any;
  manpowerLabourSpecialization: any;
  manpowerNumberOfOmaniLabours: any;
  manpowerNumberOfNonOmaniLabours: any;
  manpowerNumberOfOmaniAdmins: any;
  manpowerNumberOfNonOmaniAdmins: any;
  hasFailedToCompleteWork: any;
  hasJudgements: any;
  minimumProjectForBid: any;
  subcontractorName: any;
  typeOfServiceProvided: any;
  noOfCurrentProjects: any;
  governorateYouWorkAt: any;

  contractorResources: [] = [];
  contractorResourceTypes: any = [
    'contractor_cr_certificate',
    'owners_national_id',
    'man_powers_report',
    'company_profile_contractor',
    'other_files'
  ];
  uploadUrl = environment.upload_url;

  public projectCompletionMask = [/[1-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  engineerCount: number = 0;
  laborCount: number = 0;
  adminCount: number = 0;

  userId: number;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonserviceService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,    
  ) { }

  ngOnInit() {
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.getUsersDetailsById();
    this.pageState = history.state['page'] ? history.state['page'] : 1;
    this.generateForm();    
  }

  ngAfterViewInit() {
    window.setTimeout(() => {
      HesGallery.init({
        wrapAround: true,
        disableScrolling: true
      });
    }, 5000);
  }

  /**
   * Gets users details by id
   */
  getUsersDetailsById() {
    let urlData = {
      url: 'admin/contractor-demo?id=' + this.userId,
    };

    this.commonService.httpCallGet(urlData)
      .subscribe(data => {
        if (data.status == environment.HTTP_STATUS_OK) {
          this.usersDetails = data.data.rows[0];

          if (! this.usersDetails) {
            return;
          }

          if (this.usersDetails.user_type == 3) {
            let clientInfo = <any>[];
            let i = 0;
            let data = <any>{};
            let dataVal = <any>{};
            let dataadmin=<any>{};
            let dataengg=<any>{};

            this.usersDetails.temp_contractor_manpowers.map(itemVal => {

              if(itemVal.employee_type==1)
              {
               let manpowerEngg=<any>[];
               dataengg = {};
               dataengg.specalization=itemVal.specalization;
               dataengg.employee_no_oman=itemVal.employee_no_oman;
               dataengg.employee_no_non_oman=itemVal.employee_no_non_oman;
               this.engineerCount += itemVal.employee_no_oman + itemVal.employee_no_non_oman;
               manpowerEngg.push(dataengg);
               manpowerEngg.forEach(service => {
                this.addEngineers(service);
              });
              }
              if(itemVal.employee_type==2)
              {
               let manpowerLabour=<any>[];
               dataVal = {};
               dataVal.specalization=itemVal.specalization;
               dataVal.employee_no_oman=itemVal.employee_no_oman;
               dataVal.employee_no_non_oman=itemVal.employee_no_non_oman;
               this.laborCount += itemVal.employee_no_oman + itemVal.employee_no_non_oman;
               manpowerLabour.push(dataVal);
               manpowerLabour.forEach(service => {
                this.addLabour(service);
              });
              }
              if(itemVal.employee_type==3)
              {
               let manpowerAdmin=<any>[];
               dataadmin = {};
               dataadmin.specalization=itemVal.specalization;
               dataadmin.employee_no_oman=itemVal.employee_no_oman;
               dataadmin.employee_no_non_oman=itemVal.employee_no_non_oman;
               this.adminCount += itemVal.employee_no_oman + itemVal.employee_no_non_oman;
               manpowerAdmin.push(dataadmin);
               manpowerAdmin.forEach(service => {
                this.addAdmin(service);
              });
              }



            });


            //let workedGovournates1=<any>[];
            this.usersDetails.template_contractor_metas.map(item => {
              // console.log(item.key_name);

              if (item.key_name == 'company_website') {
                this.companyWebsite = item.key_value;
              }
              else if (item.key_name == 'years_of_experience') {
                this.yearsOfExperience = item.key_value;
              }
              else if (item.key_name == 'is_owner_or_civil') {
                this.isCivilEngineer = item.key_value;
              }
              else if (item.key_name == 'company_address') {
                this.companyAddress = item.key_value;
              }
              else if (item.key_name == 'hq_location') {
                this.headQuaterLocation = item.key_value;
              }
              else if (item.key_name == 'cr_start_date') {
                this.crStartDate = item.key_value;
              }
              else if (item.key_name == 'cr_exp_date') {
                this.crExpirationDate = item.key_value;
              }
              else if (item.key_name == 'cr_number') {
                this.crNumber = item.key_value;
              }
              else if (item.key_name == 'company_website') {
                this.companyWebsite = item.key_value;
              }
              else if (item.key_name == 'insta_account') {
                this.instagramAccount = item.key_value;
              }
              else if (item.key_name == 'linkedin_account') {
                this.linkedInAccount = item.key_value;
              }
              else if (item.key_name == 'twitter_account') {
                this.twitterAccount = item.key_value;
              }
              else if (item.key_name == 'other_marketing_platforms') {
                this.otherMarketingPlatforms = item.key_value;
              }
              // else if (item.key_name == 'Muscat') {
              //   this.governorateYouWorkAt2 = item.key_value;
              // }
              else if (item.key_name == 'project_number') {
                this.noOfCurrentProjects = item.key_value;
              }

              else if (item.key_name == 'projects_delivered') {
                this.noOfDeliveredProjects = item.key_value;
              }
              else if (item.key_name == 'largest_project_value') {
                this.largestProjectAwardedValue = item.key_value;
              }
              else if (item.key_name == 'projects_worked_on_at_once') {
                this.noOfSimultaneousProjects = item.key_value;
              }

              else if (item.key_name == 'charge_for_black_building') {
                this.chargeForBlackBuilding = item.key_value;
              }
              else if (item.key_name == 'charge_for_turnkey_projects') {
                this.chargeForTurnkeyBuilding = item.key_value;
              }

              // else if (item.key_name == 'failed_to_complete') {
              //   this.hasFailedToCompleteWork = item.key_value;
              // }


              /**client info section**/
              else if (item.key_name == 'subcontractors') {
                this.subcontractorName = item.key_value;
              }
              // else if (item.key_name == 'measures_quality_management') {
              //   this.typeOfServiceProvided = item.key_value;
              // }

              else if (item.key_name == 'measures_quality_management') {
                this.qualityManagements = item.key_value;
              }
              else if (item.key_name == 'claim_or_lawsuit_explanation') {
                this.hasJudgementsReason = item.key_value;
              }
              // else if (item.key_name == 'hasJudgements') {
              //   this.hasJudgements = item.key_value;
              // }

              // else if (item.key_name == 'projectPlanningSoftwareDetails') {
              //   this.projectPlanningSoftwareDetails = item.key_value;
              // }
              // else if (item.key_name == 'manpowerEngineerSpecialization') {
              //   this.manpowerEngineerSpecialization = item.key_value;
              // }
              // else if (item.key_name == 'manpowerNumberOfOmaniEngineers') {
              //   this.manpowerNumberOfOmaniEngineers = item.key_value;
              // }
              // else if (item.key_name == 'manpowerNumberOfNonOmaniEngineers') {
              //   this.manpowerNumberOfNonOmaniEngineers = item.key_value;
              // }
              // else if (item.key_name == 'manpowerLabourSpecialization') {
              //   this.manpowerLabourSpecialization = item.key_value;
              // }
              // else if (item.key_name == 'manpowerLabourSpecialization') {
              //   this.manpowerLabourSpecialization = item.key_value;
              // }
              // else if (item.key_name == 'manpowerNumberOfOmaniLabours') {
              //   this.manpowerNumberOfOmaniLabours = item.key_value;
              // }
              // else if (item.key_name == 'manpowerNumberOfNonOmaniLabours') {
              //   this.manpowerNumberOfNonOmaniLabours = item.key_value;
              // }
              // else if (item.key_name == 'manpowerNumberOfOmaniAdmins') {
              //   this.manpowerNumberOfOmaniAdmins = item.key_value;
              // }
              // else if (item.key_name == 'manpowerNumberOfNonOmaniAdmins') {
              //   this.manpowerNumberOfNonOmaniAdmins = item.key_value;
              // }
              else if (item.key_name == 'min_projects_to_bid') {
                this.minimumProjectForBid = item.key_value;
              }

              else if (item.group_name == 'governorate_work_at') {
                const temp = this.userDetailsForm.get('governorateYouWorkAt') as FormArray;
                //console.log(temp);

                let index = 0;
                this.workedGovournates.forEach(itemVal => {
                  if (itemVal == item.key_name) {
                    // console.log(index);
                    // this.workedGovournates1.push(itemVal);
                    // console.log('*****', item.key_value);
                    if (item.key_value == 1) {
                      temp.controls[index].patchValue({
                        index: true,
                      });
                    }
                  }
                  index++;
                });
              }

              else if (item.group_name == 'applicable_construction_activities') {
                const temp = this.userDetailsForm.get('applicableConstructionActivities') as FormArray;
                //console.log(temp);

                let index = 0;
                this.applicableConstructionActivities.forEach(itemVal => {
                  if (itemVal == item.key_name) {
                    // console.log(index);
                    // this.workedGovournates1.push(itemVal);
                    // console.log('*****', item.key_value);
                    if (item.key_value == 1) {
                      temp.controls[index].patchValue({
                        index: true,
                      });
                    }
                  }
                  index++;
                });
              }

              else if (item.group_name == 'applicable_services_provided') {
                const temp = this.userDetailsForm.get('applicableServicesProvidedByContractors') as FormArray;
               // console.log(temp);

                let index = 0;
                this.applicableServicesProvidedByContractors.forEach(itemVal => {
                  if (itemVal == item.key_name) {
                    // console.log(index);
                    // this.workedGovournates1.push(itemVal);
                    // console.log('*****', item.key_value);
                    if (item.key_value == 1) {
                      temp.controls[index].patchValue({
                        index: true,
                      });
                    }
                  }
                  index++;
                });
              }
              else if (item.group_name == 'organization_registered_at') {
               this.governorateYouWorkAt2=item.key_value;
              }
              else if (item.key_name == 'failed_to_complete') {

                this.hasFailedToCompleteWork=item.key_value;

               }
               else if (item.key_name == 'planning_software') {

                this.projectPlanningSoftware=item.key_value;

               }
               else if (item.key_name == 'rent_machinery') {

                this.rentMachinary=item.key_value;

               }
               else if (item.key_name == 'rent_machinery_details') {
                this.rentMachineryDetails = item.key_value;
              }
               else if (item.key_name == 'rent_scaffolds') {

                this.rentScaffolds=item.key_value;

               }
               else if (item.key_name == 'rent_scaffolds_details') {
                console.log("hr", item.key_name, item.key_value );
                this.rentScaffoldsDetails=item.key_value;

               }
               else if (item.key_name == 'comments') {

                this.comments=item.key_value;

               }

               else if (item.key_name == 'subcontractors') {

                this.subconstructors=item.key_value;

               }

            });

            // machineries
            let machineries = this.usersDetails.template_contractor_metas.filter(item => item.group_name == "machinery");
            let machineryKeys = ['type_of_machine', 'number_of_machine'];
            let machineriesData = [];
            for (let index = 0; index < machineries.length / 2; index++) {
              let machineryObj = {};

              machineryKeys.map(key => {
                if (key == "type_of_machine") {                  
                  machineryObj['type_of_machine'] = machineries.find(item => item.key_name == key + "_" + index).key_value;
                } else if (key == "number_of_machine") {                
                  machineryObj['number_of_machine'] = machineries.find(item => item.key_name == key + "_" + index).key_value;
                }
              });
             
              machineriesData.push(machineryObj);
            }

            machineriesData.forEach(service => {
              this.addMachineries(service);
            });            

            // Client References
            let clientReferences = this.usersDetails.template_contractor_metas.filter(item => item.group_name == "client_reference_details");
            let clientReferenceKeys = ['client_name', 'phone_num', 'project_location', 'project_value', 'project_type', 'project_completion_date'];
            clientInfo = [];

            for (let index = 0; index < 3; index++) {
              let clientObj = {};

              clientReferenceKeys.map(key => {
                if (key == "client_name") {                  
                  clientObj['client_name'] = clientReferences.find(item => item.key_name == key + "_" + index).key_value;
                } else if (key == "phone_num") {                
                  clientObj['phone_num'] = clientReferences.find(item => item.key_name == key + "_" + index).key_value;
                } else if (key == "project_location") {                  
                  clientObj['clientLocation'] = clientReferences.find(item => item.key_name == key + "_" + index).key_value;
                } else if (key == "project_value") {                  
                  clientObj['project_value'] = clientReferences.find(item => item.key_name == key + "_" + index).key_value;
                } else if (key == "project_type") {                  
                  clientObj['project_type'] = clientReferences.find(item => item.key_name == key + "_" + index).key_value;
                } else if (key == "project_completion_date") {                
                  clientObj['project_completion_date'] = clientReferences.find(item => item.key_name == key + "_" + index).key_value;
                }
              });

              clientInfo.push(clientObj);
            }
            
            clientInfo.forEach(service => {
              this.addClients(service);
            });

            // Step 7 data
            if (this.usersDetails.resource.length) {              
              this.contractorResources = this.contractorResourceTypes.map(resource_type => {
                let resource = this.usersDetails.resource.find(resource => resource.type == resource_type);
  
                return {
                  id: resource ? resource.id : 0,
                  type: resource_type,
                  url: resource ? resource.resource_url : '',
                  isPublic: resource ? resource.is_visible_client : 0
                };
              });
            }

            
            //console.log('0000000000000000', this.qualityManagements);
            // this.createServices(clientInfo);
            // this.services.push(this.createServices(clientInfo));
            this.companyName = this.usersDetails.company_name;
            // this.companyAddress=this.usersDetails.company_address;
            this.userDetailsForm.patchValue(
              {

                yearsOfExperience: this.yearsOfExperience ? this.yearsOfExperience : '',

                isCivilEngineer: this.isCivilEngineer ? this.isCivilEngineer : '',

                city: this.usersDetails.city,

                companyName: this.companyName ? this.companyName : '',

                companyAddress: this.companyAddress ? this.companyAddress : '',

                headQuaterLocation: this.headQuaterLocation ? this.headQuaterLocation : '',

                crStartDate: this.crStartDate ? this.crStartDate : '',

                crExpirationDate: this.crExpirationDate ? this.crExpirationDate : '',

                crNumber: this.crNumber ? this.crNumber : '',

                companyWebsite: this.companyWebsite ? this.companyWebsite : '',

                instagramAccount: this.instagramAccount ? this.instagramAccount : '',

                linkedInAccount: this.linkedInAccount ? this.linkedInAccount : '',

                twitterAccount: this.twitterAccount ? this.twitterAccount : '',

                otherMarketingPlatforms: this.otherMarketingPlatforms ? this.otherMarketingPlatforms : '',

                otherPrivateAndGovernmentAgencies: '',

                governorateYouWorkAt2: this.governorateYouWorkAt2 ? this.governorateYouWorkAt2 : '',

                noOfDeliveredProjects: this.noOfDeliveredProjects ? this.noOfDeliveredProjects : '',

                largestProjectAwardedValue: this.largestProjectAwardedValue ? this.largestProjectAwardedValue : '',

                noOfSimultaneousProjects: this.noOfSimultaneousProjects ? this.noOfSimultaneousProjects : '',

                chargeForBlackBuilding: this.chargeForBlackBuilding ? this.chargeForBlackBuilding : '',

                chargeForTurnkeyBuilding: this.chargeForTurnkeyBuilding ? this.chargeForTurnkeyBuilding : '',

                hasFailedToCompleteWork: this.hasFailedToCompleteWork=="1"?"1":"0",

                workFailedReason: this.workFailedReason ? this.workFailedReason : '',

                hasJudgements: this.hasJudgements=="1" ? "1" : "0",

                hasJudgementsReason: this.hasJudgementsReason ? this.hasJudgementsReason : '',

                qualityManagements: this.qualityManagements ? this.qualityManagements : '',

                projectPlanningSoftwareDetails: this.projectPlanningSoftwareDetails ? this.projectPlanningSoftwareDetails : '',

                manpowerEngineerSpecialization: this.manpowerEngineerSpecialization ? this.manpowerEngineerSpecialization : '',

                manpowerNumberOfOmaniEngineers: this.manpowerNumberOfOmaniEngineers ? this.manpowerNumberOfOmaniEngineers : '',

                manpowerNumberOfNonOmaniEngineers: this.manpowerLabourSpecialization ? this.manpowerLabourSpecialization : '',

                manpowerLabourSpecialization: this.manpowerLabourSpecialization ? this.manpowerLabourSpecialization : '',

                manpowerNumberOfOmaniLabours: this.manpowerNumberOfOmaniLabours ? this.manpowerNumberOfOmaniLabours : '',

                manpowerNumberOfNonOmaniLabours: this.manpowerNumberOfNonOmaniLabours ? this.manpowerNumberOfNonOmaniLabours : '',

                manpowerNumberOfOmaniAdmins: this.manpowerNumberOfOmaniAdmins ? this.manpowerNumberOfOmaniAdmins : '',

                manpowerNumberOfNonOmaniAdmins: this.manpowerNumberOfNonOmaniAdmins ? this.manpowerNumberOfNonOmaniAdmins : '',

                minimumProjectForBid: this.minimumProjectForBid ? this.minimumProjectForBid : '',

                subcontractorName: this.subcontractorName ? this.subcontractorName : '',

                noOfCurrentProjects: this.noOfCurrentProjects ? this.noOfCurrentProjects : '',

                projectPlanningSoftware:this.projectPlanningSoftware?this.projectPlanningSoftware:'',

                rentMachinary:this.rentMachinary?this.rentMachinary:'',

                rentMachineryDetails:this.rentMachineryDetails?this.rentMachineryDetails:'',

                rentScaffolds:this.rentScaffolds?this.rentScaffolds:'',

                rentScaffoldsDetails:this.rentScaffoldsDetails?this.rentScaffoldsDetails:'',

                comments:this.comments?this.comments:'',

                subconstructors:this.subconstructors=="1"?"1":"0",

              }
            )
          }

        }
      });
  }

  addLabour(data = null) {
    this.labours = this.userDetailsForm.get('manpowerLabour') as FormArray;

    this.labours.push(this.createLabour(data));

  }

  createLabour(data): FormGroup {
    //console.log("kkkk:",data);
    if (data) {
      return this.fb.group({
        manpowerLabourSpecialization: data.specalization,
        manpowerNumberOfOmaniLabours: data.employee_no_oman,
        manpowerNumberOfNonOmaniLabours: data.employee_no_non_oman,

      });
    } else {
      return this.fb.group({
        client_name: [''],
        phone_num: [''],
        clientLocation: [''],
        project_value: [''],
        project_type: [''],
        project_completion_date: ['']

      });
    }

  }

  addAdmin(data = null) {
    this.admin = this.userDetailsForm.get('manpowerAdmin') as FormArray;

    this.admin.push(this.createAdmin(data));
  }

  createAdmin(data): FormGroup {
    //console.log("kkkk:",data);
    if (data) {
      return this.fb.group({
        manpowerAdminSpecialization: data.specalization,
        manpowerNumberOfOmaniAdmins: data.employee_no_oman,
        manpowerNumberOfNonOmaniAdmins: data.employee_no_non_oman,

      });
    } else {
      return this.fb.group({
        client_name: [''],
        phone_num: [''],
        clientLocation: [''],
        project_value: [''],
        project_type: [''],
        project_completion_date: ['']

      });
    }

  }

  addEngineers(data = null) {
    this.engg = this.userDetailsForm.get('manpowerEngineer') as FormArray;

    this.engg.push(this.createEngineers(data));
  }

  createEngineers(data): FormGroup {
    //console.log("kkkk:",data);
    if (data) {
      return this.fb.group({
        manpowerEngineerSpecialization: data.specalization,
        manpowerNumberOfOmaniEngineers: data.employee_no_oman,
        manpowerNumberOfNonOmaniEngineers: data.employee_no_non_oman,

      });
    } else {
      return this.fb.group({
        client_name: [''],
        phone_num: [''],
        clientLocation: [''],
        project_value: [''],
        project_type: [''],
        project_completion_date: ['']

      });
    }

  }

  addClients(data = null) {
    this.services = this.userDetailsForm.get('services') as FormArray;

    this.services.push(this.createServices(data));
  }

  createServices(data): FormGroup {
    //console.log("kkkk:",data);
    if (data) {
      return this.fb.group({
        client_name: data.client_name,
        phone_num: data.phone_num,
        clientLocation: data.clientLocation,
        project_value: data.project_value,
        project_type: data.project_type,
        project_completion_date: data.project_completion_date
      });
    } else {
      return this.fb.group({
        client_name: [''],
        phone_num: [''],
        clientLocation: [''],
        project_value: [''],
        project_type: [''],
        project_completion_date: ['']

      });
    }

  }

  addMachineries(data = null) {
    this.machineries = this.userDetailsForm.get('machineries') as FormArray;

    this.machineries.push(this.createMachineries(data));
  }

  createMachineries(data): FormGroup {
    if (data) {
      return this.fb.group({
        type_of_machine: data.type_of_machine,
        number_of_machine: data.number_of_machine,
      });
    } else {
      return this.fb.group({
        type_of_machine: [''],
        number_of_machine: [''],
      });
    }
  }

  /**
	 * Actives or deactive user
	*/
  activeOrDeactiveUser() {
    let status = 1;
    if (this.usersDetails.is_active == 1) {
      status = 0;
    }
    var updateUserStatusModel = {
      user_id: this.usersDetails.id,
      is_active: status,
    }

    var urldata = {
      url: 'admin/update-user-status'
    }

    this.commonService.httpCallPost(urldata, updateUserStatusModel)
      .subscribe(data => {
        if (data.status == environment.HTTP_STATUS_OK) {
          this.toastr.success(data.msg, 'Success', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
          });
          this.usersDetails.is_active = status;
        } else {
          this.toastr.error(data.msg, 'Error', {
            timeOut: 2000,
            positionClass: 'toast-bottom-right'
          });
        }
      });
  }

  /**
   * Users status active deactive
   */
  userStatusActiveDeactive() {
    let msg = "Do you want to Deactive " + this.usersDetails.full_name + "?";
    if (this.usersDetails.is_active == 0) {
      msg = "Do you want to active " + this.usersDetails.full_name + "?";
    }
    this.commonSwalAlert(msg, 'warning', true, true, 'Cancel', 'Confirm', false, '');
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
        this.activeOrDeactiveUser();
      }
    });

  }

  /**
* Go back
*/
  goBack(): void {
    this.router.navigateByUrl('/users', { state: { pageState: this.pageState } });
  }

  /**
   * Go to previous mat stepper form
   * @param stepper MatStepper
   */
  goPrevious(stepper: MatStepper) {
    stepper.previous();
  }

  /**
   * Generate consultant signup form
   */
  generateForm() {
    this.userDetailsForm = this.fb.group({
      yearsOfExperience: new FormControl(''),
      isCivilEngineer: new FormControl('yes'),
      city: new FormControl(''),
      companyName: new FormControl(''),
      companyAddress: new FormControl(''),
      headQuaterLocation: new FormControl(''),
      crStartDate: new FormControl(''),
      crExpirationDate: new FormControl(''),
      crNumber: new FormControl(''),
      companyWebsite: new FormControl(''),
      instagramAccount: new FormControl(''),
      linkedInAccount: new FormControl(''),
      twitterAccount: new FormControl(''),
      otherMarketingPlatforms: new FormControl(''),
      governorateYouWorkAt: this.createCheckboxControls(this.workedGovournates),
      governorateYouWorkAt2: new FormControl(''),
      otherPrivateAndGovernmentAgencies: new FormControl(''),
      applicableConstructionActivities: this.createCheckboxControls(this.applicableConstructionActivities),
      applicableServicesProvidedByContractors: this.createCheckboxControls(this.applicableServicesProvidedByContractors),
      noOfCurrentProjects: new FormControl(''),
      noOfDeliveredProjects: new FormControl(''),
      largestProjectAwardedValue: new FormControl(''),
      noOfSimultaneousProjects: new FormControl(''),
      chargeForBlackBuilding: new FormControl(''),
      chargeForTurnkeyBuilding: new FormControl(''),
      minimumProjectForBid: new FormControl(''),
      hasFailedToCompleteWork: new FormControl(''),
      workFailedReason: new FormControl(''),
      hasJudgements: new FormControl(''),
      hasJudgementsReason: new FormControl(''),
      qualityManagements: new FormControl(''),
      projectPlanningSoftware: new FormControl(''),
      projectPlanningSoftwareDetails: new FormControl(''),
      manpowerEngineer: this.fb.array([]),
      manpowerLabour: this.fb.array([]),
      manpowerAdmin: this.fb.array([]),
      machineries: this.fb.array([]),
      rentMachinary: new FormControl(''),
      rentMachineryDetails: new FormControl(''),
      clientName: new FormControl(''),
      clientPhone: new FormControl(''),
      clientLocation: new FormControl(''),
      projectValue: new FormControl(''),
      projectType: new FormControl(''),
      projectCompletionDate: new FormControl(''),
      subcontractorName: new FormControl(''),
      typeOfServiceProvided: new FormControl(''),
      manpower: new FormControl(''),
      phoneNumber: new FormControl(''),
      services: this.fb.array([]),
      rentScaffolds: new FormControl(''),
      rentScaffoldsDetails: new FormControl(''),
      comments:new FormControl(''),
      subconstructors:new FormControl(''),
    });
  }

  /**
   * Create checkbox controls for form
   * @param companies
   */
  createCheckboxControls(companies) {
    const arr = companies.map(company => {
      return new FormControl(false);
    });

    return new FormArray(arr);
  }

  /**
   * Push new form control group to existing controls
   * @param data object
   */
  addEngineerManpower(data = null) {
    this.engineerManpower = this.userDetailsForm.get('manpowerEngineer') as FormArray;
    this.engineerManpower.push(this.createEngineerManpower(data));
  }

  /**
   * Create new form control group
   * @param data object
   */
  createEngineerManpower(data): FormGroup {
    if (data) {
      return this.fb.group({
        manpowerEngineerSpecialization: new FormControl(''),
        manpowerNumberOfOmaniEngineers: new FormControl(''),
        manpowerNumberOfNonOmaniEngineers: new FormControl(''),
      });
    } else {
      return this.fb.group({
        manpowerEngineerSpecialization: new FormControl(''),
        manpowerNumberOfOmaniEngineers: new FormControl(''),
        manpowerNumberOfNonOmaniEngineers: new FormControl(''),
      });
    }
  }

  /**
   * Push new form control group to existing controls
   * @param data object
   */
  addLabourManpower(data = null) {
    this.labourManpower = this.userDetailsForm.get('manpowerLabour') as FormArray;
    this.labourManpower.push(this.createLabourManpower(data));
  }

  /**
   * Create new form control group
   * @param data object
   */
  createLabourManpower(data): FormGroup {
    if (data) {
      return this.fb.group({
        manpowerLabourSpecialization: new FormControl(''),
        manpowerNumberOfOmaniLabours: new FormControl(''),
        manpowerNumberOfNonOmaniLabours: new FormControl(''),
      });
    } else {
      return this.fb.group({
        manpowerLabourSpecialization: new FormControl(''),
        manpowerNumberOfOmaniLabours: new FormControl(''),
        manpowerNumberOfNonOmaniLabours: new FormControl(''),
      });
    }
  }

  /**
   * Push new form control group to existing controls
   * @param data object
   */
  addAdminManpower(data = null) {
    this.adminManpower = this.userDetailsForm.get('manpowerAdmin') as FormArray;
    this.adminManpower.push(this.createAdminManpower(data));
  }

  /**
   * Create new form control group
   * @param data object
   */
  createAdminManpower(data): FormGroup {
    if (data) {
      return this.fb.group({
        manpowerAdminSpecialization: new FormControl(''),
        manpowerNumberOfOmaniAdmins: new FormControl(''),
        manpowerNumberOfNonOmaniAdmins: new FormControl(''),
      });
    } else {
      return this.fb.group({
        manpowerAdminSpecialization: new FormControl(''),
        manpowerNumberOfOmaniAdmins: new FormControl(''),
        manpowerNumberOfNonOmaniAdmins: new FormControl(''),
      });
    }
  }

  toggleVisibility(id: number, item) {
    this.commonService.httpCallPut({
      url: 'admin/change-image-visibility'
    }, {
      id: id,
      is_visible_client: +item.checked
    })
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
      } else {
        this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
      }
    }, error => {
      this.commonService.log(error);
    });
  }

  /**
   * Submit the form for contractor
   */
  onSubmit() {
    console.log(this.userDetailsForm.value);
  }  

  /**
   * Approve the contractor
   */
  approveContractor() {
		Swal.fire({
			title: '',
			text: 'Do you want to approve these changes?',
			type: 'warning',
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: 'Approve',
			cancelButtonText: 'Close',
			allowOutsideClick: false
		}).then((result) => {
			if (result.value) {
        let postData = {
          id: this.userId,
        }
    
        let urldata = {
          url: 'admin/approved-edit'
        }
    
        this.commonService.httpCallPut(urldata, postData)
        .subscribe(resp => {
          if (resp.status === environment.HTTP_STATUS_OK) {
            this.commonService.commonToastrMessage(resp.message, 'success', 'Success');
            this.router.navigate(['/users/edit', this.userId]);        
          } else {
            this.commonService.commonToastrMessage(resp.message, 'error', 'Error');
          }
        }, error => this.commonService.log(error));
      }
    });
  }

}
