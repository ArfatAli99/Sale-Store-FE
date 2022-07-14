import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonserviceService } from '../../commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

	show_alert: any;
	show_error_msg: any;
	email: string;
	errors: any;
	forgotPasswordForm;
	submitted: Boolean = false;

	constructor(
		public auth: AuthService,
		private router: Router,
		private forgotPwdService: CommonserviceService,
		private toastr: ToastrService,
		private fb: FormBuilder,
	) { }

	ngOnInit() {
		this.generateForm();
	}

	/**
	 * Generate the form
	 */
	generateForm() {
		this.forgotPasswordForm = this.fb.group({
			email  : new FormControl('', [Validators.required, Validators.email]),
		});
	}

	/**
	 * Close error message
	 */
	closeErrorMsg() {
		this.show_alert = false;
	}

	/**
	 * Submit forgot password request
	 */
	submitEmail() {
		this.submitted = true;
		if (this.forgotPasswordForm.invalid) {
			return;
		}

		const urldata = {
			url: 'admin/forget-password'
		};
		const obj = {
			email: this.forgotPasswordForm.get('email').value,
			url: `${window.location.origin}/reset-password` // Change to DEV server URL
		};

		this.forgotPwdService.httpCallPut(urldata, obj)
		.subscribe(data => {
			if (data.status === environment.HTTP_STATUS_OK) {
				this.forgotPwdService.commonToastrMessage(data.message, 'success', 'Success');
				this.router.navigate(['/login']);
			} else {
				this.forgotPwdService.commonToastrMessage(data.message, 'error', 'Error');
			}
		}, error => {
			this.forgotPwdService.commonToastrMessage(error, 'error', 'Error');
		});
	}
}
