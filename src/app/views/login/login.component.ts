import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

import { CommonserviceService } from '../../commonservice.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';

import { Router } from '@angular/router';

@Component({
	selector: 'app-dashboard',
	templateUrl: 'login.component.html',
	styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit{

	user: any = [];
	show_alert: any;
	show_error_msg: any;
	email: string;
	password: any;
	errors: any;
	showPass: boolean = false;

	constructor(
		public auth: AuthService,
		private router: Router,
		private loginservice: CommonserviceService,
	) { }

	ngOnInit() {
		if(this.auth.isLoggednIn) {
			this.router.navigate(['/users'])
		}
	}

	/**
	 * Closes error msg
	 */
	closeErrorMsg() {
		this.show_alert = false;
	}

	/**
	 * Loginusers login component
	 */
	loginuser() {
		var urldata = {
			url: 'admin/admin-login'
		}
		var obj = {
			email: this.email,
			password: this.password
		}
		if (this.email == undefined || this.email == '' || this.password == undefined || this.password == '') {
			this.show_error_msg = 'Validation failed!';
			this.show_alert = true;
		} else {
			this.loginservice.httpCallPost(urldata, obj)
				.subscribe(resp => {
					// this.user = data;
					if (resp.status === environment.HTTP_STATUS_OK) {
						// localStorage.setItem('profile_image', this.user.data.image);
						localStorage.setItem('lastAccessTokenSetDateTime', new Date().toString());
						this.auth.sendToken(resp.data.access_token);
						this.auth.sendrefreshToken(resp.data.refresh_token);
						this.router.navigateByUrl('/projects');
					} else {
						this.show_error_msg = resp.msg;
						this.show_alert = true;
					}
				}, error => {
					this.loginservice.log(error);
				});
		}
	}
}
