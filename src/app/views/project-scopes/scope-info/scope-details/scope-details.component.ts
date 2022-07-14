import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonserviceService } from '../../../../commonservice.service';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-scope-details',
  templateUrl: './scope-details.component.html',
  styleUrls: ['./scope-details.component.scss']
})
export class ScopeDetailsComponent implements OnInit {


  scopeId: number;
  cardTitle = "Add Scope Name";
  submitBtnText:string = "Submit";

  scopeForm: FormGroup;
  submitted: boolean = false;
  pageState: number;

   maincategories: any=[];
   sectioncategories:any=[];
   sowcategories:any=[];


  constructor(
    private route:ActivatedRoute,
    private fb:FormBuilder,
    private commonService: CommonserviceService,
    private router:Router
  ) {
    // this.scopeGroups= ///  NEED TO ASK
  }

  ngOnInit() {

    this.generateForm();
    this.getMainCategory();
    this.getSectionCategory();
    this.getSowCategory();
    this.scopeId= +this.route.snapshot.paramMap.get('id');

    if (this.scopeId) {
      this.cardTitle = 'Edit Scope Name';
      this.submitBtnText = 'Save Changes';
      this.getScopeDetails();
    }

    this.pageState = history.state['page'] ? history.state['page'] : 1;
  }


  generateForm(){
    this.scopeForm = this.fb.group({
      sectionCategory  : new FormControl('', [Validators.required]),
      mainCategory : new FormControl('', [Validators.required]),
      sowCategory : new FormControl('', [Validators.required]),
      sectionNo : new FormControl('', [Validators.required]),
      makeEquivalent  : new FormControl(''),
      makeEquivalentArabic : new FormControl(''),
      description: new FormControl('', [Validators.required]),
      descriptionArabic  : new FormControl('', [Validators.required]),


    });
  }

  get formControls(){
    return this.scopeForm.controls;
  }



  getScopeDetails(){
    let urlData={
      url: 'admin/scope-map-data'// details api sayanti will provide http://localhost:4055/api/admin/scope-map-data

    };

    this.commonService.httpCallPost(urlData, {id:this.scopeId}).subscribe(resp=>{
      if(resp.status== environment.HTTP_STATUS_OK){
        let response = resp.data.rows[0];

        this.scopeForm.patchValue({
          sectionCategory  : response.section_category_id,
          mainCategory : response.category_id ,
          sowCategory : response.scope_id,
          sectionNo : response.section_no,
          makeEquivalent  : response.make_or_equivelant,
          makeEquivalentArabic: response.make_or_equivelant_arabic,
          description: response.description,
          descriptionArabic  : response.description_arabic,

        });
      }
    });
  }


  updateScopeDetails(){
    this.submitted= true;

    if(this.scopeForm.valid){

      let url = 'admin/scope-map'
      let method_name= 'httpCallPost';
      let formValues = this.scopeForm.value;

      let formData =<any>{
        section_category_id : formValues.sectionCategory,
        category_id :formValues.mainCategory,
        scope_id :formValues.sowCategory,
        section_no : +formValues.sectionNo,
        make_or_equivelant :formValues.makeEquivalent,
        make_or_equivelant_arabic: formValues.makeEquivalentArabic,
        description : formValues.description,
        description_arabic : formValues.descriptionArabic,

      };
      if (this.scopeId){
       formData.id=this.scopeId;
      }
      let urldata={
        url:url
      }

      this.commonService[method_name](urldata,formData).subscribe(data=>{
        if(data.status===environment.HTTP_STATUS_OK|| data.status===environment.HTTP_STATUS_CREATED){
          this.commonService.commonToastrMessage(data.message, 'success', 'Success');
          this.goBack();
        } else {
          this.commonService.commonToastrMessage(data.message, 'error', 'Error')
        }
      })
    }
  }
  goBack(): void {
    this.router.navigateByUrl('/project-scopes-info-list', { state: { pageState: this.pageState } });

  }

  getMainCategory(){
      let urlData = {
        url: 'admin/master-scope'
      };

      this.commonService.httpCallGet(urlData)
      .subscribe(resp => {
        if (resp.status === environment.HTTP_STATUS_OK) {
          this.maincategories = resp.data.rows;
        }
      });
  }

  getSectionCategory(){

    let urlData = {
      url: 'admin/section-scope'
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.sectioncategories = resp.data.rows;
      }
    });
  }

  getSowCategory(){
    let urlData = {
      url: 'admin/scope'
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_OK) {
        this.sowcategories = resp.data.rows;
      }
    });
  }
}

