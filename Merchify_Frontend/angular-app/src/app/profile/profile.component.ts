import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user';
import { ProfileService } from '../profile.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderComponent } from '../order/order.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  purchases: any[] = [];
  editing = false;
  numberOfPurchases: number = 0;
  changingPassword = false;
  showPasswordFields: boolean = false; // Controla a exibição dos campos de senha
  passwords = {
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  }; 

  constructor(private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.loadProfile();
      }
    });
  }

  async loadProfile(): Promise<void> {
    try {
      console.log('Carregando perfil...');
      const data = await this.profileService.getProfile();
      console.log('Perfil carregado:', this.user);

      this.user = data.user;
      this.purchases = data.purchases;
      this.numberOfPurchases = data.number_of_purchases;

      console.log('Dados de compras:', this.purchases);


    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  async saveProfile(): Promise<void> {
    const updatedData = {
      first_name: this.user?.firstname,
      last_name: this.user?.lastname,
      email: this.user?.email,
    };

    try {
      const response = await this.profileService.updateProfile(updatedData);
      console.log('Perfil atualizado com sucesso:', response);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil.');
    }
  }

  toggleEdit(): void {
    this.editing = !this.editing;
  }

  async saveChanges(): Promise<void> {
    if (!this.user) return;

    const updateData = {
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      username: this.user.username,
    };

    try {
      await this.profileService.updateProfile(updateData);
      alert('Perfil atualizado com sucesso!');
      this.editing = false;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil.');
    }
  }

  async deleteAccount(): Promise<void> {
    if (confirm('Tem certeza que deseja deletar sua conta?')) {
      try {
        await this.profileService.deleteAccount();
        this.authService.logout(); // Redireciona para login
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
        alert('Erro ao deletar conta.');
      }
    }
  }

  togglePasswordChange(): void {
    alert('Alteração de senha ainda não implementada.');
  }

  async showOrderDetails(orderId: number): Promise<void> {
    alert(`Exibindo detalhes da encomenda #${orderId}`);
  }

  uploadProfilePicture(): void {
    document.getElementById('profileImage')?.click();
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Faça upload do arquivo ou pré-visualize
      console.log('Imagem selecionada:', file);
    }
  }

  async changePassword(): Promise<void> {
    if (!this.passwords.old_password || !this.passwords.new_password || !this.passwords.confirm_new_password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (this.passwords.new_password !== this.passwords.confirm_new_password) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      await this.profileService.changePassword(this.passwords.old_password, this.passwords.new_password);
      alert('Senha alterada com sucesso!');
      this.togglePasswordChange();
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha.');
    }
  }

  

}

