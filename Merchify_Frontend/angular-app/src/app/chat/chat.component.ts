import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompaniesService } from '../companhia.service';
import { AuthService } from '../auth.service'; // Service to fetch user details
import { User } from '../models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  currentReceiver: any = null; // Holds company or user details
  recipientId: number | undefined;
  userType: 'individual' | 'company' | 'admin' | undefined;
  isLoading: boolean = false;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private companyService: CompaniesService,
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(
      (user: User) => {
        this.userType = user.user_type as 'individual' | 'company' | 'admin';
        console.log('User type:', this.userType);

        this.recipientId = +this.route.snapshot.paramMap.get('id')!;
        this.fetchReceiverDetails();
        this.fetchMessages();
      },
      (error) => {
        console.error('Failed to fetch user info:', error);
      }
    );
  }

  async fetchReceiverDetails(): Promise<void> {
    try {
      if (this.userType === 'individual' && this.recipientId) {
        // Fetch company details
        this.currentReceiver = await this.companyService.getCompany(this.recipientId);
        console.log('Current Receiver (Company):', this.currentReceiver);
        this.currentReceiver.image
      } else if (this.userType === 'company' && this.recipientId) {
        console.log('Current Receiver (User):', this.currentReceiver);
      }
    } catch (error) {
      console.error('Error fetching receiver details:', error);
    }
  }

  fetchMessages(): void {
    if (!this.recipientId || !this.userType) return;

    this.isLoading = true;
    const fetchMethod =
      this.userType === 'individual'
        ? this.chatService.getMessagesWithCompany(this.recipientId)
        : this.chatService.getMessagesWithUser(this.recipientId);

    fetchMethod.subscribe(
      (response: any) => {
        this.messages = response.messages;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching messages:', error);
        this.isLoading = false;
      }
    );
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.recipientId) return;

    if (this.userType === 'admin') {
      console.error('Admin users cannot send messages.');
      return;
    }
    this.chatService.sendMessage(this.recipientId, this.newMessage, this.userType!).subscribe(
      (response) => {
        this.messages.push(response.message);
        this.newMessage = '';
      },
      (error) => console.error('Error sending message:', error)
    );
  }
}
