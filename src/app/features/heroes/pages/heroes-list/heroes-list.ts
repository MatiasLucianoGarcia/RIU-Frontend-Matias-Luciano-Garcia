import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeroService } from '../../services/hero-service';
import { HeroCard } from "../../components/hero-card/hero-card";
import {  MatCardModule } from "@angular/material/card";
@Component({
  selector: 'app-heroes-list',
  imports: [MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatPaginatorModule, HeroCard, MatCardModule],
  templateUrl: './heroes-list.html',
  styleUrl: './heroes-list.scss'
})
export class HeroesList implements OnInit{
  private svc = inject(HeroService);
  private router = inject(Router);
  displayed = signal(['name', 'power', 'universe', 'actions']);
  heroes = this.svc.heroes;
  filter = this.svc.filter;
  page = this.svc.page;
  totalPages = this.svc.totalPages;
  loading = this.svc.loading;

  ngOnInit() { this.svc.loadAll(); }

  onFilter(value: string) { this.svc.filterBy(value); }
  prev(){ this.svc.changePage(this.svc.page() - 1); }
  next(){ this.svc.changePage(this.svc.page() + 1); }

  goNew(){ this.router.navigate(['/heroes/new']); }
  goEdit(id: string){ this.router.navigate(['/heroes', id, 'edit']); }

  onDelete(id: string){
    if (confirm('Delete this hero?')) this.svc.delete(id);
  }
}
