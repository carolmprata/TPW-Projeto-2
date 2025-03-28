import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CONFIG } from './config';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseUrl: string = CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
  }

  getChats(id: number, userType: string): Observable<any> {
    if (!localStorage.getItem('accessToken')) {
      return throwError(() => new Error('No access token found'));
    }
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.baseUrl}/chats/${userType}/${id}/`; 
    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching chats:', error);
        return throwError(() => new Error('Failed to fetch chats.'));
      })
    );
  }
  getMessagesWithCompany(companyId: number): Observable<any> {
    const url = `${this.baseUrl}/chat/company/${companyId}/messages/`;
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching messages with company:', error);
        return throwError(() => new Error('Failed to fetch messages with company.'));
      })
    );
  }

  getMessagesWithUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/chat/user/${userId}/messages/`;
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching messages with user:', error);
        return throwError(() => new Error('Failed to fetch messages with user.'));
      })
    );
  }

  sendMessage(id: number, message: string, userType: 'individual' | 'company'): Observable<any> {
    if (!message.trim()) {
      return throwError(() => new Error('Message text cannot be empty.'));
    }

    if (userType === 'individual') {
      return this.sendMessageToCompany(id, message);
    } else if (userType === 'company') {
      return this.sendMessageToUser(id, message);
    } else {
      return throwError(() => new Error('Invalid user type.'));
    }
  }

  private sendMessageToCompany(companyId: number, message: string): Observable<any> {
    const url = `${this.baseUrl}/chat/company/${companyId}/send/`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, { text: message }, { headers }).pipe(
      catchError((error) => {
        console.error('Error sending message to company:', error);
        return throwError(() => new Error('Failed to send message to the company.'));
      })
    );
  }

  private sendMessageToUser(userId: number, message: string): Observable<any> {
    const url = `${this.baseUrl}/chat/user/${userId}/send/`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, { text: message }, { headers }).pipe(
      catchError((error) => {
        console.error('Error sending message to user:', error);
        return throwError(() => new Error('Failed to send message to the user.'));
      })
    );
  }
  
  getUnreadMessagesCount(): Observable<any> {
    const url = `${this.baseUrl}/unread-messages/`;
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching unread messages count:', error);
        return throwError(() => new Error('Failed to fetch unread messages count.'));
      })
    );
  }
}
