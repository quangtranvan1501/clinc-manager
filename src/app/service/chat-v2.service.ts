import { Injectable } from '@angular/core';
import { Database, ref, push, set, onValue, query, orderByChild, limitToLast } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Message {
  senderID: string;
  receiverID: string;
  username: string;
  message: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatV2Service {

  constructor(private db: Database) { }

  generateChatID(senderID: string, receiverID: string): string {
    return senderID < receiverID ? `${senderID}_${receiverID}` : `${receiverID}_${senderID}`;
  }

  getMessages(chatID: string, messageLimit: number): Observable<Message[]> {
    const messagesRef = query(
      ref(this.db, `messages/${chatID}`),
      orderByChild('timestamp'),
      limitToLast(messageLimit)
    );
    return new Observable<Message[]>(observer => {
      onValue(messagesRef, snapshot => {
        const messages: any = [];
        snapshot.forEach(childSnapshot => {
          messages.push(childSnapshot.val() as Message);
        });
        observer.next(messages.reverse());
      });
    });
  }

  sendMessage(chatID: string, message: Message): void {
    const messagesRef = ref(this.db, `messages/${chatID}`);
    const newMessageRef = push(messagesRef);
    set(newMessageRef, message);
  }
}
