import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonserviceService } from '../../../../commonservice.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-aritical-request-dialog',
  templateUrl: './aritical-request-dialog.component.html',
  styleUrls: ['./aritical-request-dialog.component.scss']
})
export class AriticalRequestDialogComponent implements OnInit {

  inviteArticleTopicRequestForm: FormGroup;
  submitted: boolean = false;
  articlesTopicListDetails: any = [];

  /**
   * Creates an instance.
   * input: @param fb
   * @param commonService
   * @param dialogRef
   * created by : Biswajit
   */
  constructor(public dialogRef: MatDialogRef<AriticalRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public consulttantHubId: any,
    private fb: FormBuilder,
    private commonService: CommonserviceService,
  ) {
    // console.log(this.consulttantHubId);

    this.inviteArticleTopicRequestForm = this.fb.group({
      article_topic: ['', [Validators.required]],
    });
  }


  /**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by : Biswajit
   */
  ngOnInit() {
    this.articlesTopicListng();
  }

  /**
   * Determines whether no click on
   * method: dialog
   * input: dialog
   * purpose: to close th edialog when no is clicked
   * created by:  Bisajit
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
 * Gets add edit article topic
 * created by: Sourav
 */
  get articleTopicRequestController() { return this.inviteArticleTopicRequestForm.controls; }

  /**
   * Articles listng
   * method: GET
   * ouput: data
   * created by: Sourav
   */
  articlesTopicListng() {
    let urlData = {
      url: 'admin/topics?uid=' + this.consulttantHubId
    };
    this.commonService.httpCallGet(urlData)
      .subscribe(data => {
        // console.log(data.data);
        if (data.status == environment.HTTP_STATUS_OK) {
          this.articlesTopicListDetails = data.data.rows;
        }
      });
  }

  /**
   * Submits aritical request dialog component
   * @returns
   * created by: Sourav
   */
  submit() {
    // console.log("SUBMIT", this.inviteArticleTopicRequestForm,"this.inviteArticleTopicRequestForm.invalid=",this.inviteArticleTopicRequestForm.invalid);
    if (this.inviteArticleTopicRequestForm.invalid) {
      this.submitted = true;
      return;
    } else {
      this.submitted = false;
      this.invitationArticleTopicRequestApi();
    }
  }

  /**
   * Invitations article topic request api
   * method: POST
   * output: data
   * created by: Sourav
   */
  invitationArticleTopicRequestApi() {
    let postData = {
      uid: this.consulttantHubId,
      topic_id: this.inviteArticleTopicRequestForm.get('article_topic').value
    };
    let urlData = {
      url: 'admin/invite-articles',
    };
    this.commonService.httpCallPost(urlData, postData)
      .subscribe(data => {
        if (data.status == environment.HTTP_STATUS_CREATED) {
          this.commonService.commonToastrMessage(data.message, 'success', 'Success');
          this.dialogRef.close('success')
        } else {
          this.commonService.commonToastrMessage(data.message, 'error', 'Error');
        }
      });
  }

}
