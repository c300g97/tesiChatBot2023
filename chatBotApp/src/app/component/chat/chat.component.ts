import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { ChatServiceService } from 'src/app/service/chat-service.service';
declare let html2pdf: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  conversation: any[] = [];
  userInput: string = '';
  users: any[] = [];
  user: any;
  api: any = 'Chat GPT 3.5 turbo';

  constructor(
    private chatService: ChatServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      this.users = data;
      console.log('Users recuperati : ' + JSON.stringify(data));
    });

    this.user = window.sessionStorage.getItem('user');
  }

  sendMessage() {
    if (this.userInput.trim() === '') {
      return;
    }

    const userMessage = {
      role: 'user',
      content: this.userInput,
    };

    this.conversation.push(userMessage);

    this.chatService.sendMessage(this.conversation).subscribe(
      (response) => {
        const assistantMessage = {
          role: 'assistant',
          content: response.choices[0].message.content,
        };
        this.conversation.push(assistantMessage);
        this.userInput = '';
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  downloadChatAsPdf() {
    const chatContainer = this.chatContainer.nativeElement;
    const chatContent = chatContainer.innerText;
    let chat = chatContent.replace('Send', '');

    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(chat, 180); // Adjust the width (180) as needed
    pdf.text(lines, 10, 10); // Add the lines of text to the PDF

    const blob = pdf.output('blob');
    saveAs(blob, this.user + '.pdf');
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
