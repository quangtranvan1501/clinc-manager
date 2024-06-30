import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  distinctUntilChanged,
} from 'rxjs';
import { environment } from './environments/environments';
import { initializeApp } from '@angular/fire/app';
import { getMessaging } from '@angular/fire/messaging';
import { getToken, onMessage } from '@firebase/messaging';
import { messaging } from '../@types/firebase.conf';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class MessagingService implements OnInit,OnDestroy {
  messageSubject: Subject<any> = new Subject<any>();
  currentMessage = new BehaviorSubject(null);
  private deviceToken: string = '';

  constructor(
    private appService: AppService,
  ) {
    // const app = initializeApp(environment.firebaseConfig);
    // const messaging = getMessaging(app);
  }
  ngOnInit() {
    this.listen();
  }
  ngOnDestroy(): void {
    this.messageSubject.unsubscribe();
  }
  async requestPermission(userId: string) {
    try {
      const currentToken = await messaging.getToken({
        vapidKey: environment.firebaseConfig.vapidKey,
      });
      console.log('currentToken', currentToken);
      this.deviceToken = currentToken;
      const body = {
        deviceToken: currentToken,
      };
      this.appService.update<any, any>( body, `/users/device/${userId}`).subscribe(response => {
        console.log(response);
      })
      return currentToken;
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
      return null; // Add a return statement to handle the error case
    }
  }
  // requestPermission() {
  //   messaging
  //     .getToken({ vapidKey: environment.firebaseConfig.vapidKey })
  //     .then((currentToken) => {
  //       // console.log(currentToken);
  //       return currentToken;
  //       // if (currentToken) {

  //       //   const userId = this.tokenStorage.getUser().Id;
  //       //   const payload = {
  //       //     deviceToken: currentToken,
  //       //     userId: userId,
  //       //   };

  //       //   this.http
  //       //     .post("/api/SaveNotifyFcmToken", payload)
  //       //     .subscribe((response: any) => {

  //       //     });
  //       // } else {
  //       //   console.log(
  //       //     "No registration token available. Request permission to generate one."
  //       //   );
  //       // }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  getDeviceToken(){
    return this.deviceToken;
  }

  listen() {
    messaging.onMessage((message) => this.messageSubject.next(message));
  }

  messageObservable(): Observable<any> {
    return this.messageSubject.asObservable().pipe(distinctUntilChanged());
  }
}
