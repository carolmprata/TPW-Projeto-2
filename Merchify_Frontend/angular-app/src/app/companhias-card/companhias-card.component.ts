import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Company } from '../models/company';
import { Router } from '@angular/router';
import { FavoritesService } from '../favorites.service';
import { User } from '../models/user';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-companhias-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './companhias-card.component.html',
  styleUrls: ['./companhias-card.component.css']
})
export class CompanhiasCardComponent {
  @Input() company!: Company;
  @Input() isAuthenticated!: boolean;
  @Input() user: User | null = null;  
  @Input() userType: string = '';
  isAuthenticaded: boolean = false;
  

  constructor(private favoriteService: FavoritesService, private router: Router,private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (this.authService.isAuthenticated()) {
        this.isAuthenticaded = true;
        this.userType = user?.user_type || '';
      }
    });
    console.log('user-cards:', this.user);
  }

  toggleFavorite(event: Event): void {
    event.preventDefault(); 
    event.stopPropagation(); 
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.company.is_favorited) {
      this.favoriteService.removeFavoriteCompany(this.company.id);
      this.company.is_favorited = false;
    }
    else {
      this.favoriteService.addFavoriteCompany(this.company.id);
      this.company.is_favorited = true;
    }
  }
}
