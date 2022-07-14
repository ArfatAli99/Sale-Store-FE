import { Component, OnInit, Input } from '@angular/core';
import { CommonserviceService } from '../../commonservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  oldPassToggle: string = 'password';
  newPassToggle: string = 'password';
  confPassToggle: string = 'password';
  changePasswordForm: FormGroup;
  submitted: Boolean = false;

  showOldPass: boolean = false;
  showNewPass: boolean = false;
  showConfPass: boolean = false;

  /**
   * Creates an instance.
   * input: @param fb
   * @param passwordChangeService 
   * @param toastr
   * @param location
   * created by : Biswajit
   */
  constructor(
    private fb: FormBuilder,
    private passwordChangeService: CommonserviceService,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(environment.passwordPattern)]],
      confPassword: ['', [Validators.required]],
    }, {
        validator: MustMatch('newPassword', 'confPassword'),
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
   * Gets password change controller
   * @returns
   * created by: Biswajit
   */
  get passwordChangeController() { return this.changePasswordForm.controls; }

  /**
   * Password show hide
   * @param event 
   * created by: Biswajit
   */
  showPass(id) {
    if (id == 1) {
      this.oldPassToggle = this.oldPassToggle == 'password' ? 'text' : 'password';
    }
    else if (id == 2) {
      this.newPassToggle = this.newPassToggle == 'password' ? 'text' : 'password';
    }
    else if (id == 3) {
      this.confPassToggle = this.confPassToggle == 'password' ? 'text' : 'password';
    }
  }

  /**
   * Changes password
   * @returns  
   * created by: Biswajit
   */
  changePassword() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    } else {
      this.submitted = false;
      var urldata = {
        url: 'admin/change-password'
      }
      var passwordData = {
        password: this.changePasswordForm.get('oldPassword').value.trim(),
        new_password: this.changePasswordForm.get('newPassword').value.trim()
      };

      this.passwordChangeService.httpCallPut(urldata, passwordData)
        .subscribe(data => {
          if (data.status == 1) {
            this.toastr.success(data.msg, 'Success', {
              timeOut: 2000,
              positionClass: 'toast-bottom-right'
            });
            this.location.back();
          } else {
            this.toastr.error(data.msg, 'Error', {
              timeOut: 2000,
              positionClass: 'toast-bottom-right'
            });
          }
        });
    }
  }
}


/**
 * Must match
 * @param controlName 
 * @param matchingControlName 
 * @returns  
 */
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}