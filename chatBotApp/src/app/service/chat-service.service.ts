import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = '';
  private usersUrl = 'assets/json/users.json';

  constructor(private http: HttpClient) {}

  sendMessage(conversation: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      messages: conversation,
      model: 'gpt-3.5-turbo',
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
  getUsers(): Observable<any> {
    return this.http.get(this.usersUrl).pipe(map((response: any) => response));
  }
}
