import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Headers } from '@angular/http';
import { Http } from '@angular/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {
  private headers: any;
  User: any;
  letsimpleObservable: any;

  defaultStages = [
    'primary_payment',
    'maintenance'
  ];

  allowedImageTypes = ["jpg", "png", "jpeg"];

  constructor(private httpClient: HttpClient,
    private toastr: ToastrService) {
  }

  /**
   * Https callrefreshtoken post
   * @param urldata
   * @param sendData
   * @returns callrefreshtoken post
   */
  httpCallrefreshtokenPost(urldata: any, sendData: any): Observable<any> {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(environment.api_url + urldata.urltoken, sendData, { headers: this.headers }).pipe(
      map((result: Response) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }


  /**
   * Https call get
   * @param urldata
   * @returns call get
   */
  httpCallGet(urldata: any): Observable<any> {
    if (!localStorage.getItem('access_token')) {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('access_token') });
    }
    return this.httpClient.get(environment.api_url + urldata.url, { headers: this.headers }).pipe(
      map((result: Response) => {
        return result;
      })
    );
  }

  /**
   * Https call post
   * @param urldata
   * @param sendData
   * @returns call post
   */
  httpCallPost(urldata: any, sendData: any): Observable<any> {
    if (!localStorage.getItem('access_token')) {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('access_token') });
    }
    return this.httpClient.post(environment.api_url + urldata.url, sendData, { headers: this.headers }).pipe(
      map((result: Response) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }


    /**
   * Https call post
   * @param urldata
   * @param sendData
   * @returns call post
   */
  httpCallPostFormurlEncoded(urldata: any, sendData: any): Observable<any> {
    if (!localStorage.getItem('access_token')) {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    } else {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token': localStorage.getItem('access_token') });
    }
    return this.httpClient.post(environment.api_url + urldata.url, sendData, { headers: this.headers }).pipe(
      map((result: Response) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }

  // httpCallPostTemp2(sendData: any): Observable<any> {
  //   if (!localStorage.getItem('accesstoken')) {
  //     this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   } else {
  //     this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('accesstoken') });
  //   }
  //   return this.httpClient.put('http://192.168.1.191:4028/api/admin/resetpassword', sendData, { headers: this.headers }).pipe(
  //     map((result: Response) => {
  //       return result;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Https call put
   * @param urldata
   * @param sendData
   * @returns call put
   */
  httpCallPut(urldata: any, sendData: any): Observable<any> {
    if (!localStorage.getItem('access_token')) {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    } else {
      this.headers = new HttpHeaders({ 'x-access-token': localStorage.getItem('access_token') });
    }
    return this.httpClient.put(environment.api_url + urldata.url, sendData, { headers: this.headers }).pipe(
      map((result: Response) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Https call postformdata
   * @param urldata
   * @param sendData
   * @returns call postformdata
   */
  httpCallPostformdata(urldata: any, sendData: any): Observable<any> {
    if (!localStorage.getItem('access_token')) {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    } else {
      this.headers = new HttpHeaders({ 'x-access-token': localStorage.getItem('access_token') });
    }
    return this.httpClient.post(environment.api_url + urldata.url, sendData, { headers: this.headers }).pipe(
      map((result: Response) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Https call putformdata
   * @param urldata
   * @param sendData
   * @returns call putformdata
   */
  httpCallPutformdata(urldata: any, sendData: any): Observable<any> {
    if (!localStorage.getItem('access_token')) {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    } else {
      this.headers = new HttpHeaders({ 'x-access-token': localStorage.getItem('access_token') });
    }
    return this.httpClient.put(environment.api_url + urldata.url, sendData, { headers: this.headers }).pipe(
      map((result: Response) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Https call delete
   * @param urldata
   * @param sendData
   * @returns call delete
   */
  httpCallDelete(urldata: any, sendData: any): Observable<any> {
    if (!localStorage.getItem('access_token')) {
      this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    } else {
      this.headers = new HttpHeaders({ 'x-access-token': localStorage.getItem('access_token') });
    }

    const httpOptions = {
      headers: this.headers, body: sendData
    };

    return this.httpClient.delete(environment.api_url + urldata.url, httpOptions).pipe(
      map((result: Response) => {
        return result;
      }),
      catchError(this.handleError)
    );
  }  

  /**
   * Handles error
   * @param err
   * @returns
   */
  handleError(err: Response | any) {
    return throwError(err);
  }

  // private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     // TODO: send the error to remote logging infrastructure
  //     console.error('Backend returned status code: ', error.status); // log to console instead

  //     // TODO: better job of transforming error for user consumption


  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }

  /**
   * Display Toastr Message
   * @param msg string
   * @param toastrType string
   * @param type string
   * @param position string
   * @param duration string
   * @param color string
   */
  commonToastrMessage(msg,toastrType,type,position='toast-bottom-right',duration='2000',color=''){
    this.toastr[toastrType](msg, type, {
      timeOut: duration,
      positionClass: position
    });
  }

  /**
   * Convert object to url parameters
   * @param obj object
   */
  convertToUrlParams(obj) {
    return new URLSearchParams(obj).toString();
  }

  /**
   * Get day difference
   */
  getDayDiff(date_1) {
    if (! date_1) {
      return;
    }

    let end_date = new Date(date_1);
    let curr_date = new Date();

    // To calculate the time difference of two dates
    let Difference_In_Time = end_date.getTime() - curr_date.getTime();

    // To calculate the no. of days between two dates
    let Difference_In_Days = Math.ceil( Difference_In_Time / (1000 * 3600 * 24) );

    return Math.max(Difference_In_Days, 0);
  }

  /**
   * Get Language Groups
   *
   * @returns Array
   */
  getLanguageGroups() {
    return new Promise(async (resolve, reject) => {
      await fetch('assets/files/language-groups.json')
      .then(data => data.json())
      .then(resp => {
        resolve(resp);
      })
    });
  }


  /**
   * Get Project statuses
   *
   * @returns Array
   */
  getProjectStatuses() {
    return [
      'Draft',
      'Pending',
      'Preparing for Tender',
      'Returned',
      'Archived',
      'Awarded',
      'Signed'
    ];
  }

  /**
   * Log data to console
   * @param data Any
   */
  log(...data) {
    if (! environment.production) {
      console.log(...data);
    }
  }

    /**
   * Check if file is an image
   * @param fileName String
   */
  isImageFile(fileName: string) {

    if (!fileName) {
      return false;
    }

    let fileExtension = fileName.split(".").reverse()[0].toLowerCase();

    return this.allowedImageTypes.includes(fileExtension);
  }

}
