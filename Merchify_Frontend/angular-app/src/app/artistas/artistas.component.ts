import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-artistas',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './artistas.component.html', 
  styleUrls: ['./artistas.component.css'], 
})
export class ArtistasComponent {

}
