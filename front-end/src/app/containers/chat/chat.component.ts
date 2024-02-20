import { Component } from '@angular/core';
import { UsernameComponent } from '../../components/username/username.component';
import * as io from 'socket.io-client';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [UsernameComponent,CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  userName = '';
  message = '';
  messageList: {message: string, userName: string, mine: boolean}[] = []
  userList: string[] = [];
  socket: any;


  userNameUpdate(name: string): void {
    this.socket = io.io(`localhost:5001?userName=${name}`);
    this.userName = name;

    this.socket.emit('ste-user-name', name);

    this.socket.on('user-list', (userList: string[]) => {
      this.userList = userList;
    });

    this.socket.on('message-broadcast', (data:{message: string, userName: string}) => {
      if (data) {
        this.messageList.push({message: data.message, userName: data.userName, mine:false})
      }
    });
  }

  sendMessage(): void{
    this.socket.emit('message', this.message);
    this.messageList.push({message: this.message, userName: this.userName, mine:true});
    this.message = '';
  }


}
