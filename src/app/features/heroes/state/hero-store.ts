import { computed, Injectable, signal } from '@angular/core';
import { Hero } from '../domain/hero.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroStore {
  private readonly _heroes = signal<Hero[]>([]);
  private readonly _filter = signal<string>('');
  private readonly _page = signal<number>(1);
  private readonly _pageSize = signal<number>(5);
  private readonly _loading = signal<boolean>(false);

  readonly heroes = computed(() => this._heroes());
  readonly filter = computed(() => this._filter());
  readonly page = computed(() => this._page());
  readonly pageSize = computed(() => this._pageSize());
  readonly loading = computed(() => this._loading());

  constructor(private http: HttpClient) {}

  readonly filteredHeroes = computed(() => {
    const q = this._filter().trim().toLowerCase();
    const list = this._heroes();
    if (!q) return list;
    return list.filter(h => h.name.toLowerCase().includes(q));
  });

  readonly totalItems = computed(() => this.filteredHeroes().length);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this._pageSize()))
  );

  readonly pagedHeroes = computed(() => {
    const page = this._page();
    const size = this._pageSize();
    const list = this.filteredHeroes();
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  // setters
  setHeroes(list: Hero[]) {
    this._heroes.set(list);
    this._page.set(1);
  }

  loadHeroes() {
    this.http.get<Hero[]>('/heroes').subscribe({
      next: (list) => {
        this.setHeroes(list);
        this.setLoading(false);
      },
      error: () => {
        this.setLoading(false);
      }
    });
  }

  setLoading(v: boolean) { 
    this._loading.set(v); 
  }
  setFilter(query: string) {
    this._filter.set(query ?? ''); 
    this._page.set(1); 
  }
  setPage(page: number) { 
    this._page.set(Math.max(1, Math.min(page, this.totalPages()))); 
  }
  setPageSize(size: number) { 
    this._pageSize.set(size); 
    this._page.set(1); 
  }
  
}
