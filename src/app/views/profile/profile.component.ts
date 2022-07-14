import { environment } from './../../../environments/environment';
import { BroadcasterService } from './../../broadcaster.service';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from '../../commonservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'underscore';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
	fileToUpload: File = null;
	imageUrl: string = "";
	input_type: string = 'password';
	profile_details: any = [];
	// countryList: any = environment.countryList;
	profileForm: FormGroup;
	submitted: Boolean = false;
	profileImage: string;
	imageSubscribe: any;

	@ViewChild('Image')
	myFileInput: ElementRef

	constructor(
		private profileDetailsService: CommonserviceService,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private broadcasterService: BroadcasterService,
	) {
		this.profileForm = this.fb.group({
			name: ['', [Validators.required]],
			phone: ['', [Validators.required, Validators.pattern(environment.phoneNumberPattern)]],
			email: ['', [Validators.required, Validators.pattern(environment.emailPattern)]],
			address: [''],
		});
		this.getAdminProfileInformation();
	}

	ngOnInit() {
		// CAST BROADCAST SERVICE SUBSCRIPTION 
		this.imageSubscribe = this.broadcasterService.cast.subscribe(profileImage => this.profileImage = profileImage);
	}

	ngOnDestroy(): void {
		// CAST BROADCAST SERVICE UNSUBSCRIPTION 
		this.imageSubscribe.unsubscribe();
	}

	/**
	 * Keys press allow only number
	 * @param event 
	 */
	_keyPress(event: any) {
		const pattern = /[0-9]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	/**
	 * function to trigger click event on input[type=file]
	 */
	triggerFileInputClick() {
		this.myFileInput.nativeElement.click();
	}

	/**
	 * Handles file input
	 * @param file 
	 */
	handleFileInput(file: FileList) {
		this.fileToUpload = file.item(0);
		var reader = new FileReader();
		reader.onload = (event: any) => {
			this.imageUrl = event.target.result;
		}
		reader.readAsDataURL(this.fileToUpload);
	}

	/**
	 * Gets profile controller
	 */
	get profileController() { return this.profileForm.controls; }


	/**
	 * Updates admin profile info
	 * @returns  
	 */
	updateAdminProfileInfo() {
		this.submitted = true;
		if (this.profileForm.invalid) {
			return;
		} else {
			if (this.profileForm.get('name').value.trim() == "") {
				this.profileForm.patchValue({
					name: this.profileForm.get('name').value.trim(),
				});
				return;
			} else {
				this.submitted = false;
				var urldata = {
					url: 'admin/update-admin'
				}

				let formData: FormData = new FormData();
				formData.append('name', this.profileForm.get('name').value.trim());
				formData.append('email', this.profileForm.get('email').value);
				formData.append('phone', this.profileForm.get('phone').value);
				formData.append('address', this.profileForm.get('address').value.trim());
				if (this.fileToUpload) {
					formData.append('image', this.fileToUpload, this.fileToUpload.name);
				}

				this.profileDetailsService.httpCallPut(urldata, formData)
					.subscribe(data => {
						if (data.status == 1) {
							this.toastr.success(data.msg, 'Success', {
								timeOut: 2000,
								positionClass: 'toast-bottom-right'
							});
							this.getAdminProfileInformation();
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
	 * Gets admin profile information
	 */
	getAdminProfileInformation() {
		var urldata = {
			url: 'admin/account-details'
		}
		this.profileDetailsService.httpCallGet(urldata)
			.subscribe(data => {
				if (data.status == 1) {
					this.profile_details = data.data;
					if (this.profile_details.image != null && this.profile_details.image != undefined && this.profile_details.image != '') {
						this.imageUrl = environment.base_url + this.profile_details.image;
						localStorage.setItem('profile_image', this.profile_details.image);
						// CALL BROADCAST SERVICE EDIT IMAGE FUNCTION
						this.broadcasterService.editImage(this.profile_details.image);
					}
					this.profileForm.patchValue({
						name: this.profile_details.name,
						phone: this.profile_details.phone,
						email: this.profile_details.email,
						address: this.profile_details.address,
					});
				} else {
					this.toastr.error(data.msg, 'Error', {
						timeOut: 2000,
						positionClass: 'toast-bottom-right'
					});
				}
			});
	}
}