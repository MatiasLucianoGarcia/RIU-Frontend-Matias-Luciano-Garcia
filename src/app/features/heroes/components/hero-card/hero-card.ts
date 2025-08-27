import { Component, EventEmitter, input, output } from '@angular/core';
import { Hero } from '../../domain/hero.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hero-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.scss'
})
export class HeroCard {

  hero = input.required<Hero>();
  onEditClick  = output<void>();
  onDeleteClick  = output<void>();

  onEdit(){
    this.onEditClick.emit();
  }

  onDelete(){
    this.onDeleteClick.emit();
  }
}
