import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppService } from 'src/app/service/app.service';
import { ChatService } from 'src/app/service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: any[] = [];
  message: string = '';
  user:any;
  userId: string = '';
  tvvs: any[] = [];

  selectTVV(ttv: any): void {
    this.userId = ttv.userId;
  }

  constructor(
    private chatService: ChatService,
    private appService: AppService
  ) { }

  sendMessage(): void {
    this.chatService.sendMessage({
      message: this.message, 
      to: this.userId
    });
    this.message = '';
  }

  getMessages(): void {
    this.chatService.getMessages().subscribe((message: any) => {
  
      this.messages.push(message);
      this.userId = message.from;
      console.log(this.messages);
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('currentUser')) {
      return;
    }
    this.user = JSON.parse(localStorage.getItem('currentUser') ?? '{}');

    this.chatService.addUser(this.user.userId, this.user.role);
    this.getMessages();
    let params = new HttpParams();
    params = params.append('role', 'user');
    params = params.append('page', '1');
    params = params.append('limit', '10');

    this.appService.getOption<any>(params, '/message/onlineUsers').subscribe((res: any) => {
      this.tvvs = res.body;
      console.log(this.tvvs);
    });
  }
}
