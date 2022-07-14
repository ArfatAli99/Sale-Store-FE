import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class NotificationService {

    private url = environment.socketUrl;
    private socket;
    private eventName: string = 'new_notifications_entry';

    constructor() {
        this.socket = io(this.url);
    }

    /**
     * Send notification to server
     * @param message String
     * created by Biswajit
     */
    public sendMessage(message) {
        this.socket.emit(this.eventName, {note: message});
    }

}