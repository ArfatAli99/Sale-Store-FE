import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonserviceService } from '../../../commonservice.service';
import { AuthService } from '../../../auth.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-article-topic-add-edit',
  templateUrl: './article-topic-add-edit.component.html',
  styleUrls: ['./article-topic-add-edit.component.scss']
})
export class ArticleTopicAddEditComponent implements OnInit {

  addEditForm: FormGroup;
  articleTopicId: number = 0;
  button_name: string = "Submit";
  submitted = false;
  pageState: number;

 /**
   * Creates an instance.
   * input: @param fb 
   * @param route 
   * @param router 
   * @param auth
   * created by : Biswajit
   */
  constructor(private fb: FormBuilder,
    private router: Router,
    private commonService: CommonserviceService,
    private route: ActivatedRoute,
    public auth: AuthService,) { 

      this.addEditForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        status: ['1', [Validators.required]],
      });
    }

    /**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by : Biswajit
   */
  ngOnInit() {
    this.articleTopicId = +this.route.snapshot.paramMap.get('id');
    if (this.articleTopicId) {
      this.button_name = "Update";
      this.getArticleTopicDetailsById();
    }
    this.pageState = history.state['page'] ? history.state['page'] : 1;
  }


  /**
   * Gets add edit article topic
   * @returns
   * created by: Sourav
   */
  get addEditArticleTopic() { return this.addEditForm.controls; }

  /**
   * Adds or edit car details
   * created by: Sourav
   */
  addOrEditArticleTopicDetails() {
    this.submitted = true;
    let method = 'httpCallPost';

    if (this.addEditForm.invalid) {
      return;
    } else {
      if (this.addEditForm.get('name').value.trim() == "") {
        this.addEditForm.patchValue({
          name: this.addEditForm.get('name').value.trim(),
        });
        return;
      } else if (this.addEditForm.get('description').value.trim() == "") {
        this.addEditForm.patchValue({
          description: this.addEditForm.get('description').value.trim(),
        });
        return;
      } else {
        this.submitted = false;
        var insertModel = {
          name: this.addEditForm.get('name').value,
          description: this.addEditForm.get('description').value,
          status: this.addEditForm.get('status').value,
        }
        let model:any = insertModel;
        if (this.articleTopicId) {
          method = 'httpCallPut';

          var updateModel = {
            id: this.articleTopicId,
            name: this.addEditForm.get('name').value,
            description: this.addEditForm.get('description').value,
            status: this.addEditForm.get('status').value,
          }
          model = updateModel;
        }

        var urldata = {
          url: 'admin/article-topic'
        }

        // console.log(model);

        this.commonService[method](urldata, model)
          .subscribe(data => {
           if (data.status == environment.HTTP_STATUS_OK || data.status == environment.HTTP_STATUS_CREATED) {
              Swal.fire({
                title: data.message,
                type: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false
              }).then((result) => {
                if (result.value) {
                  if(method == 'httpCallPost'){
                    this.router.navigate(['/topic']);
                   } else {
                      this.goBack();
                   }
                }
              })
            } else {
              this.commonService.commonToastrMessage(data.message, 'error', 'Error');
            }
          });
      }
    }
  }



  /**
   * Gets article topic details by id
   * method: GET
   * output: data
   * created by: Biswajit
   */
  getArticleTopicDetailsById() {
    var urldata = {
      url: 'admin/article-topic-details?id=' + this.articleTopicId ,
    }
  
    this.commonService.httpCallGet(urldata)
      .subscribe(data => {
        if (data.status == environment.HTTP_STATUS_OK) {
          let update_details = data.data.rows[0];
          this.addEditForm.patchValue({
            name: update_details.name,
            description: update_details.description,
            status: update_details.is_active.toString(),
          });

        } else {
          this.commonService.commonToastrMessage(data.message, 'error', 'Error');
          this.goBack();
        }
      });
  }

 /**
 * Go back
 * purpose: when clicked back, navigate back to article
 * created by: Sourav
 */
  goBack(): void {
    // this.location.back();
    this.router.navigateByUrl('/topic', { state: { pageState:this.pageState }});
  }

}
