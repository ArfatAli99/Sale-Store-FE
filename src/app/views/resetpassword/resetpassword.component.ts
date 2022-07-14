import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonserviceService } from '../../commonservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MustMatch } from '../change-password/change-password.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-resetpassword',
	templateUrl: './resetpassword.component.html',
	styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

	oldPassToggle = 'password';
	newPassToggle = 'password';
	confPassToggle = 'password';
	changePasswordForm: FormGroup;
	submitted: Boolean = false;
	token: string;
	requestId: number;
	requestedUserId: number;

	constructor(
		private fb: FormBuilder,
		private passwordChangeService: CommonserviceService,
		private toastr: ToastrService,
		private location: Location,
		private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonserviceService
	) {
		this.changePasswordForm = this.fb.group({
			newPassword: ['', [Validators.required, Validators.pattern(environment.passwordPattern)]],
			confPassword: ['', [Validators.required]],
		}, {
			validator: MustMatch('newPassword', 'confPassword'),
		});
	}
	ngOnInit() {
		this.token = this.route.snapshot.paramMap.get('token');
		this.validateToken(this.token);
	}

	get passwordChangeController() { 
		return this.changePasswordForm.controls; 
	}

	/**
	 * Validate the forgot password link token
	 * @param token string
	 */
	validateToken(token: string) {
		const urldata = {
			url: `details-of-forget-password-link?validation_hash=${token}`
		};
		this.passwordChangeService.httpCallGet(urldata)
		.subscribe(response => {
			if (response.status != environment.HTTP_STATUS_OK) {
				this.commonService.commonToastrMessage(response.message, 'error', 'Error');
				this.router.navigate(['/login']);
			} else {
				this.requestId       = response.data.id;
				this.requestedUserId = response.data.uid;
			}
		}, error => {
			this.commonService.commonToastrMessage(error, 'error', 'Error');
			this.router.navigate(['/login']);
		});
	}

	/**
	 * Toggle the password field
	 * @param id string
	 */
	showPass(id) {
		if (id === 2) {
			this.newPassToggle = this.newPassToggle === 'password' ? 'text' : 'password';
		} else if (id === 3) {
			this.confPassToggle = this.confPassToggle === 'password' ? 'text' : 'password';
		}
	}

	/**
	 * Reset the password
	 */
	onSubmit() {
		this.submitted = true;
		if (this.changePasswordForm.invalid) {
			return;
		}
		const newPass = this.changePasswordForm.get('newPassword').value;
		const conPass = this.changePasswordForm.get('confPassword').value;
		const curToken = this.router.url.substring(22, this.router.url.length - 6);
		const urldata = {
			url: 'admin/reset-password'
		};
		const obj = {
			password: newPass,
			id      : this.requestId,
			uid     : this.requestedUserId
		};
		
		this.passwordChangeService.httpCallPut(urldata, obj).subscribe((data: any) => {
			if (data.status === environment.HTTP_STATUS_OK) {
				this.toastr.success(data.msg, 'Success!', {
					timeOut: 2500,
					positionClass: 'toast-bottom-right'
				});
				this.router.navigate(['/login']);
			} else {
				this.toastr.error(data.msg, 'Error!', {
					timeOut: 2500,
					positionClass: 'toast-bottom-right'
				});
			}
		}, error => {
			this.toastr.error(error.message, 'Error!', {
				timeOut: 2500,
				positionClass: 'toast-bottom-right'
			});
		});
	}
}
