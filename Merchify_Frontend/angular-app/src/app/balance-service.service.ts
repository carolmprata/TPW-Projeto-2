import { Injectable } from '@angular/core';
import { CONFIG } from './config';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private baseUrl: string = CONFIG.baseUrl;

  constructor() {}

  private async getToken(): Promise<string> {
    if (localStorage.getItem('accessToken') === null) {
      throw new Error('Token de autenticação ausente. Faça login novamente.1');
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token de autenticação ausente. Faça login novamente.');
    }
    return token;
  }


  async getBalance(): Promise<{ balance: number }> {
    const token = await this.getToken();
    try {
      const response = await fetch(`${this.baseUrl}/balance/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch balance');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching balance:', error.message);
      throw error;
    }
  }


  async updateBalance(amount: number): Promise<any> {
    const token = await this.getToken();

    try {
      console.log('Updating balance:', amount);
      const response = await fetch(`${this.baseUrl}/balance/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ amount }),
      });
      
      

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update balance');
      }

      return await response.json();
    } catch (error: any) {
      console.error(`Error:`, error.message);
      throw error;
    }
  }


  async addFunds(amount: number): Promise<any> {
    const token = await this.getToken();

    try {
      console.log('Add balance:', amount);
      const response = await fetch(`${this.baseUrl}/balance/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ amount }),
      });
      
      

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update balance');
      }

      return await response.json();
    } catch (error: any) {
      console.error(`Error:`, error.message);
      throw error;
    }
  }
}
