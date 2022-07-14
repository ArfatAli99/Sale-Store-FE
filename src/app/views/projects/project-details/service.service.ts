import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class FileService {

    private fileDataSubject = new Subject();
    fileData = this.fileDataSubject.asObservable();    

    passFile(fileData) {
        this.fileDataSubject.next(fileData);
    }
}