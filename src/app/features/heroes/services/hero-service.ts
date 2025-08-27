import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Hero, HeroId } from '../domain/hero.model';
import { HeroStore } from '../state/hero-store';
import { HeroRepository } from '../data/hero-repository';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private readonly repo = inject(HeroRepository);
  private readonly store = inject(HeroStore);
  private readonly destroyRef = inject(DestroyRef);

  heroes = this.store.pagedHeroes;  // lista paginada
  loading = this.store.loading;
  filter = this.store.filter;
  page = this.store.page;
  totalPages = this.store.totalPages;
  totalItems = this.store.totalItems;
  pageSize = this.store.pageSize;

  lastError = signal<string | null>(null);
  
  loadAll(): void {
    this.lastError.set(null);
    this.store.setLoading(true);

    this.repo.findAll$()
      .pipe(finalize(() => this.store.setLoading(false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => this.store.setHeroes(list),
        error: (err) => this.lastError.set(String(err?.message ?? err)),
      });
  }
  
  filterBy(query  : string): void { 
    this.store.setFilter(query); 
  }
  changePage(page: number): void { 
    this.store.setPage(page); 
  }
  changePageSize(size: number): void { 
    this.store.setPageSize(size); 
  }

  getById(id: HeroId): Hero | undefined {
    return this.store.heroes().find(hero => hero.id === id)
      ?? undefined;
  }

  create(dto: Omit<Hero, 'id'|'createdAt'|'updatedAt'>): void {
    this.lastError.set(null);
    this.store.setLoading(true);

    this.repo.create$(dto)
      .pipe(finalize(() => this.store.setLoading(false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadAll(),
        error: (err) => this.lastError.set(String(err?.message ?? err)),
      });
  }

  update(id: HeroId, changes: Partial<Hero>): void {
    this.lastError.set(null);
    this.store.setLoading(true);

    this.repo.update$(id, changes)
      .pipe(finalize(() => this.store.setLoading(false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadAll(),
        error: (err) => this.lastError.set(String(err?.message ?? err)),
      });
  }

  delete(id: HeroId): void {
    this.lastError.set(null);
    this.store.setLoading(true);
    this.repo.remove$(id)
      .pipe(finalize(() => this.store.setLoading(false)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadAll(),
        error: (err) => this.lastError.set(String(err?.message ?? err)),
      });
  }
}
