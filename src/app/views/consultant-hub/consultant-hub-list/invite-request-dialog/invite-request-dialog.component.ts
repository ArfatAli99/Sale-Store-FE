import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonserviceService } from '../../../../commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-invite-request-dialog',
  templateUrl: './invite-request-dialog.component.html',
  styleUrls: ['./invite-request-dialog.component.scss']
})
export class InviteRequestDialogComponent implements OnInit {

  inviteRequestForm: FormGroup;
  submitted: boolean = false;

  /**
   * Creates an instance.
   * input: @param commonservice
   * @param fb
   * @param dialogRef
   * created by : Biswajit
   */
  constructor(public dialogRef: MatDialogRef<InviteRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commonService: CommonserviceService,
    private toastr: ToastrService
  ) {

    this.inviteRequestForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(environment.emailPattern)]],
    });
  }

  /**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by : Biswajit
   */
  ngOnInit() {
  }

 
  /**
   * Determines whether no click on
   * method: dialog
   * input: dialog
   * purpose: to close th edialog when no is clicked
   * created by:  Biswajit
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**
* Gets add edit article topic
*/
  get inviteRequestFormController() { return this.inviteRequestForm.controls; }

  /**
   * Submits invite request dialog component
   * @returns  
   */
  submit() {
    if (this.inviteRequestForm.invalid) {
      this.submitted = true;
      return;
    } else {
      if (this.inviteRequestForm.get('fullName').value.trim() == "") {
        this.inviteRequestForm.patchValue({
          fullName: this.inviteRequestForm.get('fullName').value.trim(),
        });
        return;
      } else if (this.inviteRequestForm.get('email').value.trim() == "") {
        this.inviteRequestForm.patchValue({
          email: this.inviteRequestForm.get('email').value.trim(),
        });
        return;
      } else {
        this.submitted = false;
        this.invitationRequestApi();
      }
    }
  }

  /**
   * Invitations request api
   */
  invitationRequestApi() {
    let postData = {
      name: this.inviteRequestForm.get('fullName').value,
      email: this.inviteRequestForm.get('email').value
    };
    let urlData = {
      url: 'admin/invite-to-consultant',
    };
    this.commonService.httpCallPost(urlData, postData)
      .subscribe(data => {
        if (data.status == environment.HTTP_STATUS_OK) {
          this.commonService.commonToastrMessage(data.msg, 'success', 'Success');
          this.dialogRef.close('success')
        } else {
          this.commonService.commonToastrMessage(data.msg, 'error', 'Error');
        }
      });
  }
}
