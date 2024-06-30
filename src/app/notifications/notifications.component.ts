import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { MessagingService } from '../service/messaging.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy{
  visible = false;
  notifications: any[] = [];
  user: any;
  countNotificaton: number = 0;
  subscriptions: Subscription[] = [];

  constructor(
    private appService: AppService,
    private messagingService: MessagingService
  ) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  getNotifications() {
    const params = {
      receiverId: this.user.userId,
      sortBy: ['createdAt:desc'],
      page: 1,
      limit: 10
    }

    return this.appService.query<any>(params, '/notifications/user').subscribe((res) => {
      if (!res.body) {
        return;
      }
      this.notifications = res.body.data.results;
      this.countNotificaton = res.body.data.countNoti;
    });

  }
  readAllNotification() {
    this.appService.getById<any>(this.user.userId, '/notifications/read-all').subscribe((res) => {
      this.getNotifications();
    })
  }

  updateNotification(notificationId: any) {
    const body ={
      read: '1'
    }
    return this.appService.update<any, any>(body, `/notifications/update/${notificationId}`).subscribe((res) => {
      this.getNotifications();
    });
  }

  ngOnInit() {
    const currentUser = sessionStorage.getItem('currentUser')
    if (currentUser) {
      this.user = JSON.parse(currentUser)
      this.getNotifications();
    }

    this.messagingService.listen();

    this.subscriptions.push(this.messagingService.messageObservable().subscribe((message) => {
      this.notifications = [message, ...this.notifications];
      this.countNotificaton += 1;
      console.log(message)
    }));
    // console.log(this.subscriptions)
  }

}
