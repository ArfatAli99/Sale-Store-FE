import { DashboardComponent } from './views/dashboard/dashboard.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse }
  from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { CommonserviceService } from './commonservice.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Injectable()
export class RefreshTokenInterceptorService implements HttpInterceptor {
  constructor(
    private spinner: NgxSpinnerService,
    private accessTokenRefreshService: CommonserviceService,
    public auth: AuthService,
    private router: Router,
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    var apiTimeIntervalDifferenrt = new Date().setMinutes(new Date().getMinutes() - 30);
    var tokenTimeIntervalDifferenrt = new Date().setMinutes(new Date().getMinutes() - 90);
    var lastaApiCallTime = new Date(localStorage.getItem('lastApiCallDatatime')).getTime();
    var lastAccessTokenSetDateTime = new Date(localStorage.getItem('lastAccessTokenSetDateTime')).getTime();
    if (lastaApiCallTime != 0 && (lastaApiCallTime < apiTimeIntervalDifferenrt)) {
      localStorage.clear();
      this.router.navigate(["/login"], { replaceUrl: true });
      return EMPTY;
    } else if (lastAccessTokenSetDateTime != 0 && (lastAccessTokenSetDateTime < tokenTimeIntervalDifferenrt)) {
      this.accessTokenRegenerator();
    }

    this.spinner.show();
    return next.handle(req).pipe(tap(evt => {
      // console.log(evt);
      // this.spinner.hide();
      if (evt instanceof HttpResponse) {
        this.spinner.hide();
        // console.log(evt.body.status);
        if ('body' in evt) {
          if (evt.body.status == 403) {
            localStorage.clear();
            this.router.navigate(["/login"], { replaceUrl: true });
            return EMPTY;
          } else {
            localStorage.setItem('lastApiCallDatatime', new Date().toString());
          }
        }
      }
    }, finalize(() => {
      this.spinner.hide();
    }))
    );
  }


  /**
   * Access token regenerator
   */
  accessTokenRegenerator() {
    var urltokendata = {
      urltoken: 'refresh-token'
    }
    var tokenmodel = {
      refresh_token: localStorage.getItem("refreshtoken")
    }
    localStorage.setItem('lastAccessTokenSetDateTime', new Date().toString());
    this.accessTokenRefreshService.httpCallrefreshtokenPost(urltokendata, tokenmodel)
      .subscribe(data => {
        this.auth.sendToken(data.data.access_token);
        this.auth.sendrefreshToken(data.data.refresh_token);
      });
  }
}