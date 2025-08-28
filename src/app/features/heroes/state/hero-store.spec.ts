import { HeroStore } from './hero-store';
import { Hero, Universe } from '../domain/hero.model';

import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('HeroStore', () => {
  let store: HeroStore;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    store = new HeroStore(httpClientSpy);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should set and get heroes', () => {
    const heroes: Hero[] = [
      { id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '' },
      { id: '2', name: 'B', universe: Universe.DC, createdAt: '', updatedAt: '' }
    ];
    store.setHeroes(heroes);
    expect(store.heroes()).toEqual(heroes);
  });

  it('should filter heroes by name', () => {
    const heroes: Hero[] = [
      { id: '1', name: 'Spider', universe: Universe.MARVEL, createdAt: '', updatedAt: '' },
      { id: '2', name: 'Batman', universe: Universe.DC, createdAt: '', updatedAt: '' }
    ];
    store.setHeroes(heroes);
    store.setFilter('spider');
    expect(store.filteredHeroes()).toEqual([heroes[0]]);
  });

    it('should return empty filteredHeroes if filter does not match', () => {
      const heroes: Hero[] = [
        { id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '' },
        { id: '2', name: 'B', universe: Universe.DC, createdAt: '', updatedAt: '' }
      ];
      store.setHeroes(heroes);
      store.setFilter('ZZZ');
      expect(store.filteredHeroes()).toEqual([]);
    });

    it('should not fail when setting page out of range', () => {
      const heroes: Hero[] = [
        { id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '' },
        { id: '2', name: 'B', universe: Universe.DC, createdAt: '', updatedAt: '' }
      ];
      store.setHeroes(heroes);
      store.setPageSize(1);
      store.setPage(10); // fuera de rango
      expect(store.page()).toBeLessThanOrEqual(store.totalPages());
    });

  it('should change page and page size', () => {
    store.setPageSize(5);
    store.setPage(2);
    expect(store.page()).toBe(1);
    store.setPageSize(10);
    expect(store.pageSize()).toBe(10);
  });

  it('should calculate totalItems and totalPages', () => {
    const heroes: Hero[] = [
      { id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '' },
      { id: '2', name: 'B', universe: Universe.DC, createdAt: '', updatedAt: '' }
    ];
    store.setHeroes(heroes);
    expect(store.totalItems()).toBe(2);
    expect(store.totalPages()).toBe(1);
    store.setPageSize(1);
    expect(store.totalPages()).toBe(2);
  });

  it('should return pagedHeroes', () => {
    const heroes: Hero[] = [
      { id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '' },
      { id: '2', name: 'B', universe: Universe.DC, createdAt: '', updatedAt: '' },
      { id: '3', name: 'C', universe: Universe.OTHER, createdAt: '', updatedAt: '' }
    ];
    store.setHeroes(heroes);
    store.setPageSize(2);
    store.setPage(2);
    expect(store.pagedHeroes()).toEqual([heroes[2]]);
  });

  it('should call setLoading(false) on loadHeroes success', () => {
    httpClientSpy.get.and.returnValue(of([{ id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '' }]));
    spyOn(store, 'setLoading');
    store.loadHeroes();
    expect(store.setLoading).toHaveBeenCalledWith(false);
  });

  it('should call setLoading(false) on loadHeroes error', () => {
    httpClientSpy.get.and.returnValue(throwError(() => new Error('fail')));
    spyOn(store, 'setLoading');
    store.loadHeroes();
    expect(store.setLoading).toHaveBeenCalledWith(false);
  });
});
