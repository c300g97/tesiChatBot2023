import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatServiceService } from 'src/app/service/chat-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private router: Router,
    private chatService: ChatServiceService
  ) {}

  ngOnInit() {}

  login() {
    this.chatService.getUsers().subscribe(
      (users: any) => {
        const user = users.find(
          (user: any) =>
            user.username === this.username && user.password === this.password
        );

        if (user) {
          window.sessionStorage.setItem('user', user.username);
          this.router.navigate(['/chat']);
        } else {
          this.error = 'Invalid username or password';
        }
      },
      (error: any) => {
        this.error = 'Failed to retrieve user data';
      }
    );
  }
}
