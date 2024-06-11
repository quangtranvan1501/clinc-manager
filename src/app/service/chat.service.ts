import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  sendMessage(message: any) {
    this.socket.emit('send-msg', message);
  }

  getMessages() {
    return this.socket.fromEvent('receive-msg');
  }

  addUser(userId: string, role: string) {
    this.socket.emit('add-user', {userId, role});
  }
}
