import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/map';
// import { fromEvent } from 'rxjs';
// import { filter } from 'rxjs/operators';
// import 'rxjs/Rx';
// import {Observable} from 'rxjs/Observable';

// interface BroadcastEvent {
//   key: any;
//   data?: any;
// }
@Injectable({
  providedIn: 'root'
})
export class BroadcasterService {
  // private _eventBus: Subject<BroadcastEvent>;

  // constructor() {
  //   this._eventBus = new Subject<BroadcastEvent>();
  // }

  // broadcast(key: any, data?: any) {
  //   this._eventBus.next({key, data});
  // }
 
  // on<T>(key: any): Observable<T> {
  //   return this._eventBus.asObservable()
  //     .filter(event => event.key === key)
  //     .map(event => <T>event.data);
  // }

  private _dataBus = new BehaviorSubject<string>(localStorage.getItem('profile_image'));
  cast = this._dataBus.asObservable();

  constructor(){
  }

  /**
   * Edits image
   * @param newImage 
   */
  editImage(newImage){
    this._dataBus.next(newImage);
  }

}
