
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { DatePipe } from '@angular/common'
import { AppComponent } from './app.component';
import { PagerService } from './_services/index';
import { ExcelService } from './excel.service';

// Import containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { CommonserviceService } from './commonservice.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
// import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { RefreshTokenInterceptorService } from './refresh-token-interceptor.service';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ResetpasswordComponent } from './views/resetpassword/resetpassword.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';

//import { CmsGridComponent } from './views/cms-grid/cms-grid.component';
// import { McBreadcrumbsModule } from 'ngx-breadcrumbs';

@NgModule({
  imports: [
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBwsof0d3uDDZ3kRBEpJeXhhPf7RxZK1_Y',
    //   libraries: ['places', 'drawing', 'geometry']
    // }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ToastrModule.forRoot(), // ToastrModule added
    NgxSpinnerModule,  // SPINNER ADDED
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    ForgotPasswordComponent,
    ResetpasswordComponent,
    // ChangePasswordComponent

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RefreshTokenInterceptorService,
    multi: true
  },
    CommonserviceService, PagerService, AuthGuard, AuthService, ExcelService, DatePipe,
  // {
  //   provide: LocationStrategy,
  //   useClass: HashLocationStrategy,
  // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }