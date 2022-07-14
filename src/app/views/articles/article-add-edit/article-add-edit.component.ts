import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonserviceService } from '../../../commonservice.service';
import { AuthService } from '../../../auth.service';
import Swal from 'sweetalert2';

declare var CKEDITOR;
@Component({
  selector: 'app-article-add-edit',
  templateUrl: './article-add-edit.component.html',
  styleUrls: ['./article-add-edit.component.scss']
})
export class ArticleAddEditComponent implements OnInit {
  // @ViewChild('myEditor') myEditor: any;
  addEditForm: FormGroup;
  articleId: number = 0;
  button_name: string = "Submit";
  submitted = false;
  pageState: number;
  config:any;

      /**
   * Creates an instance.
   * input: @param commonservice
   * @param router
   * @param route
   * @param auth
   * created by : Biswajit
   */

  constructor(private fb: FormBuilder,
    private router: Router,
    private commonService: CommonserviceService,
    private route: ActivatedRoute,
    public auth: AuthService, ) {

    this.config = {
      filebrowserUploadUrl: environment.editor_upload_url,
      allowedContent: true,
      removeEmpty: false,
      removeFormatAttributes: '',
      removeFormatTags: '',
      extraPlugins: 'autogrow, justify, image2',
      removePlugins: 'image',
    };

    this.addEditForm = this.fb.group({
      title      : ['', [Validators.required]],
      writer_name: ['', [Validators.required]],
      writer     : ['', [Validators.required]],
      data       : ['', [Validators.required]],
      is_approved: ['1', [Validators.required]],
    });
  }

/**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by : Biswajit
   */
  ngOnInit() {
    this.articleId = +this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.button_name = "Update";
      this.getArticleDetailsById();
    }
    this.pageState = history.state['page'] ? history.state['page'] : 1;
  }

  // private getEditorContent() {
  //   let key = <any> Object.keys(CKEDITOR.instances);

  //   if (CKEDITOR && CKEDITOR.instances[key]) {
  //     return CKEDITOR.instances[key].getData();
  //   }

  //   return '';
  // }


  /**
   * Gets add edit article topic
   * @returns
   * created by : Sourav
   */
  get addEditArticleTopic() { return this.addEditForm.controls; }

  /**
   * Adds or edit car details
   * created by Sourav
   * purpose: to add or edit article details
   */
  addOrEditArticleDetails() {
    this.submitted = true;
    let method = 'httpCallPost';

    if (this.addEditForm.invalid) {
      return;
    } else {
      if (this.addEditForm.get('title').value.trim() == "") {
        this.addEditForm.patchValue({
          name: this.addEditForm.get('title').value.trim(),
        });
        return;
      } else if (this.addEditForm.get('writer').value.trim() == "") {
        this.addEditForm.patchValue({
          writer: this.addEditForm.get('writer').value.trim(),
        });
        return;
      } else if (this.addEditForm.get('data').value.trim() == "") {
        this.addEditForm.patchValue({
          data: this.addEditForm.get('data').value.trim(),
        });
        return;
      } else {
        this.submitted = false;
        var insertModel = {
          title: this.addEditForm.get('title').value,
          writer_name: this.addEditForm.get('writer_name').value,
          writer: this.addEditForm.get('writer').value,
          data: this.addEditForm.get('data').value,
          // data: this.getEditorContent(),
          is_approved: this.addEditForm.get('is_approved').value,
        }
        let model: any = insertModel;
        if (this.articleId) {
          method = 'httpCallPut';

          var updateModel = {
            id: this.articleId,
            title: this.addEditForm.get('title').value,
            writer_name: this.addEditForm.get('writer_name').value,
            writer: this.addEditForm.get('writer').value,
            data: this.addEditForm.get('data').value,
            is_approved: this.addEditForm.get('is_approved').value,
          }
          model = updateModel;
        }

        var urldata = {
          url: 'admin/article-details'
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
                  if (method == 'httpCallPost') {
                    this.router.navigate(['/article']);
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
   * Gets car details by car id
   * method: GET
   * output: data
   * created by: Sourav
   * purpose: get article details by id
   */
  getArticleDetailsById() {
    var urldata = {
      url: 'admin/article-details?id=' + this.articleId,
    }

    this.commonService.httpCallGet(urldata)
      .subscribe(data => {
        if (data.status == environment.HTTP_STATUS_OK) {
          let update_details = data.data.rows[0];
          this.addEditForm.patchValue({
            title: update_details.title,
            writer_name: update_details.writer_name,
            writer: update_details.writer,
            data: update_details.data,
            is_approved: update_details.is_approved
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
    this.router.navigateByUrl('/article', { state: { pageState: this.pageState } });
  }
}