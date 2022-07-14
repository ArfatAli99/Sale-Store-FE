import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class AuthService {
	constructor(private myRoute: Router) { }
	sendToken(token: string) {
		localStorage.setItem("access_token", token)
	}
	sendrefreshToken(token: string) {
		localStorage.setItem("refresh_token", token)
	}
	// sendrefreshToken(token: string) {
	//   localStorage.setItem("refreshtoken", token)
	// }
	getToken() {
		return localStorage.getItem("access_token")
	}
	getrefreshToken() {
		return localStorage.getItem("refresh_token")
	}
	isLoggednIn() {
		return this.getToken() !== null;
	}
	logout() {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		this.myRoute.navigate(["login"]);
	}
}