import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/service/app.service';
import { ChatV2Service } from 'src/app/service/chat-v2.service';
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
  chatId: string = '';

  selectTVV(ttv: any): void {
    this.userId = ttv.userId;
    this.chatId = this.chatV2Service.generateChatID(this.user.userId, this.userId);
    this.getMessagesV2();
  }

  constructor(
    private chatService: ChatService,
    private appService: AppService,
    private chatV2Service: ChatV2Service,
    private route: ActivatedRoute
  ) { }

  sendMessage(): void {
    this.chatService.sendMessage({
      message: this.message, 
      to: this.userId
    });
    this.message = '';
  }

  sendMessageV2(): void {
    const message = {
      senderID: this.user.userId,
      receiverID: this.userId,
      username: this.user.username,
      message: this.message,
      timestamp: Date.now()
    };
    this.chatV2Service.sendMessage(this.chatId, message);
    this.message = '';
  }

  getMessagesV2(): void {
    this.chatV2Service.getMessages(this.chatId, 10).subscribe(messages => {
      this.messages = Object.values(messages);
      this.messages.reverse();
    });
  }

  getMessages(): void {
    this.chatService.getMessages().subscribe((message: any) => {
  
      this.messages.push(message);
      this.userId = message.from;
      console.log(this.messages);
    });
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('currentUser')) {
      return;
    }
    this.user = JSON.parse(sessionStorage.getItem('currentUser') ?? '{}');

    this.chatService.addUser(this.user.userId, this.user.role);
    // this.getMessages();
    // this.getMessagesV2();
    let params = new HttpParams();
    params = params.append('role', 'user');
    params = params.append('page', '1');
    params = params.append('limit', '10');

    this.appService.getOption<any>(params, '/message/onlineUsers').subscribe((res: any) => {
      this.tvvs = res.body;
      console.log(this.tvvs);
    });

    this.route.params.subscribe(params => {
      console.log(params['userId']);
      this.userId = params['userId'];
      this.selectTVV({userId: this.userId})
    });
  }
}
