import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule,RouterModule],
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  category: string = 'products';
  favoriteProducts: any[] = [];
  favoriteArtists: any[] = [];
  favoriteCompanies: any[] = [];

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.loadProducts();
  }
  

  switchCategory(category: string): void {
    this.category = category;

    if (category === 'products') {
      this.loadProducts();
    } else if (category === 'artists') {
      this.loadArtists();
    } else if (category === 'company') {
      this.loadCompanies();
    }
  }

  async loadProducts(): Promise<void> {
    this.favoriteProducts = await this.favoritesService.getFavorites('products');
    console.log('Produtos favoritos:', this.favoriteProducts);
  }

  async loadArtists(): Promise<void> {
    this.favoriteArtists = await this.favoritesService.getFavorites('artists');
    console.log('Artistas favoritos:', this.favoriteArtists);
  }

  async loadCompanies(): Promise<void> {
    this.favoriteCompanies = await this.favoritesService.getFavorites('company');
    console.log('Companhias favoritas:', this.favoriteCompanies);
  }

  async removeProductFromFavorites(id: number): Promise<void> {
    await this.favoritesService.removeFavorite(id);
    this.favoriteProducts = this.favoriteProducts.filter(product => product.product.id !== id);
  }

  async removeArtistFromFavorites(id: number): Promise<void> {
    await this.favoritesService.removeFavoriteArtist(id);
    this.favoriteArtists = this.favoriteArtists.filter(artist => artist.artist.id !== id);
  }

  async removeCompanyFromFavorites(id: number): Promise<void> {
    await this.favoritesService.removeFavoriteCompany(id);
    this.favoriteCompanies = this.favoriteCompanies.filter(company => company.company.id !== id);
  }
}
