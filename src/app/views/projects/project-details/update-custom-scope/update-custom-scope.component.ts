import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CommonserviceService } from '../../../../commonservice.service';

@Component({
  selector: 'app-update-custom-scope',
  templateUrl: './update-custom-scope.component.html',
  styleUrls: ['./update-custom-scope.component.scss']
})
export class UpdateCustomScopeComponent implements OnInit {

  projectId: number;
  projectScopes: any = [];
  supplyAndInstallByContractorScope: any = [];
  supplyAndInstallByClientScope: any = [];
  suppliedByClientAndInstalledByContractorScope: any = [];
  defaultScopes: any = [];
  scopeQuestions: any = [];
  electricalItemsByContractor: any = [];
  plumbingByContractor: any = [];
  finishingByContractor: any = [];
  electricalItemsByOneParty: any = [];
  finishingByOneParty: any = [];

  updateScopesForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonserviceService,
  ) {
    this.projectId = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getProjectScopes();
  }

  /**
   * Get Project Scopes
   */
  getProjectScopes() {
    let urlData = {
      url: 'admin/project-details?project_id=' + this.projectId,
    };

    this.commonService.httpCallGet(urlData)
    .subscribe(resp => {
      if (resp.status === environment.HTTP_STATUS_CREATED) {
        let projectDetails = resp.project_details.rows[0];

        if (projectDetails) {
          this.projectScopes = projectDetails.project_metas;

          this.defaultScopes               = [
                                                ...this.filterScopes(this.projectScopes, "supply_and_install_by_contractor"),
                                                ...this.filterScopes(this.projectScopes, "supply_and_install_by_client"),
                                                ...this.filterScopes(this.projectScopes, "supplied_by_client_and_installed_by_contractor")
                                              ];
          this.scopeQuestions              = this.filterScopes(this.projectScopes, "custom_scope");
          this.electricalItemsByContractor = this.filterScopes(this.projectScopes, "electrical_items_by_contractor");
          this.plumbingByContractor        = this.filterScopes(this.projectScopes, "plumbing_by_contractor");
          this.finishingByContractor       = this.filterScopes(this.projectScopes, "finishing_by_contractor");
          this.electricalItemsByOneParty   = this.filterScopes(this.projectScopes, "electrical_items_by_one_party");
          this.finishingByOneParty         = this.filterScopes(this.projectScopes, "finishing_by_one_party");

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
   * Filter project scopes
   * @param scopes array
   * @param groupName string
   */
  filterScopes(scopes, groupName) {
    return scopes.filter(scope => scope.project_scope.group_name == groupName);
  }



  /**
   * Set custom scope questions
   * @param scope object
   * @param e integer
   * @param index integer
   */
  setScope(scope, e, index) {
    this.scopeQuestions[index].q_result = e;
  }



  /**
   * Toggle Electrical Items
   * @param scope object
   * @param e integer
   * @param index integer
   */
  toggleCustomquestionScope(scope, e, index) {
    this.electricalItemsByContractor[index].supplied_by = e;
    this.electricalItemsByContractor[index].installed_by = 3;
  }



  /**
   * Toggle Plumbing
   * @param scope object
   * @param e integer
   * @param index integer
   */
  togglePlumbing(scope, e, index) {
    this.plumbingByContractor[index].supplied_by = e;
    this.plumbingByContractor[index].installed_by = 3;
  }



  /**
   * Toggle Finishing
   * @param scope object
   * @param e integer
   * @param index integer
   */
  toggleFinishing(scope, e, index) {
    this.finishingByContractor[index].supplied_by = e;
    this.finishingByContractor[index].installed_by = 3;
  }



  /**
   * Toggle Electrical Items
   * @param scope object
   * @param e integer
   * @param index integer
   */
  toggleElectricByOne(scope, e, index) {
    this.electricalItemsByOneParty[index].supplied_by = e;
    this.electricalItemsByOneParty[index].installed_by = e;
  }



  /**
   * Toggle Finishing
   * @param scope object
   * @param e integer
   * @param index integer
   */
  toggleFinishingByOne(scope, e, index) {
    this.finishingByOneParty[index].supplied_by = e;
    this.finishingByOneParty[index].installed_by = e;
  }



  /**
   * Submit updated project scopes
   */
  updateScopes() {
    let urlData = {
      url: 'admin/scope'
    };

    let formData = {
      project_meta: JSON.stringify( [
        ...this.defaultScopes,
        ...this.scopeQuestions, 
        ...this.electricalItemsByContractor, 
        ...this.plumbingByContractor, 
        ...this.finishingByContractor, 
        ...this.electricalItemsByOneParty,
        ...this.finishingByOneParty
      ] )
    };

    this.commonService.httpCallPost(urlData, formData)
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

}
