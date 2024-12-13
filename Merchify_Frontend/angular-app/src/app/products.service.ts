import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from './models/produto';
import { base64toBlob } from './utils';
import { CONFIG } from './config';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  baseUrl: string = CONFIG.baseUrl;

  constructor(private router:Router) { }

  //getProduct
  async getProduct(id:number):Promise<Product>{
    //path('ws/product/<int:identifier>/',  views.productDetails, name='productDetails'),
    const url = this.baseUrl + '/produtos/' + id;
    const data: Response =  await fetch(url);
    const product: Product = await data.json() ?? [];
    if (product.image) {
      const blob = base64toBlob(product.image, 'image/png');
      product.image = URL.createObjectURL(blob);
    }
    return product;

  }


  //getProducts
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products: Product[] = await response.json();
      return products.map((product) => ({
        ...product,
        image: `http://localhost:8000${product.image}`, 
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/product/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });      
    }
    catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  async editProduct(product: Product): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/products/${product.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
    } catch (error) {
      console.error('Error editing product:', error);
    }
  }
  
}
