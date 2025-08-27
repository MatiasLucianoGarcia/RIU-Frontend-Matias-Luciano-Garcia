import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero-service';
import { HeroStore } from '../state/hero-store';
import { HeroRepository } from '../data/hero-repository';
import { of, throwError } from 'rxjs';
import { Hero, Universe } from '../domain/hero.model';

describe('HeroService', () => {
  let service: HeroService;
  let repoSpy: jasmine.SpyObj<HeroRepository>;
  let storeSpy: jasmine.SpyObj<HeroStore>;

  beforeEach(() => {
    repoSpy = jasmine.createSpyObj('HeroRepository', ['findAll$', 'create$', 'update$', 'remove$']);
    storeSpy = jasmine.createSpyObj('HeroStore', ['setHeroes', 'setLoading', 'setFilter', 'setPage', 'setPageSize', 'heroes', 'filter', 'page', 'totalPages', 'totalItems', 'pageSize']);

    TestBed.configureTestingModule({
      providers: [
        HeroService,
        { provide: HeroRepository, useValue: repoSpy },
        { provide: HeroStore, useValue: storeSpy },
      ]
    });
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call loadAll and update heroes', () => {
    const heroes: Hero[] = [{ id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '' }];
    repoSpy.findAll$.and.returnValue(of(heroes));
    service.loadAll();
    expect(repoSpy.findAll$).toHaveBeenCalled();
    expect(storeSpy.setHeroes).toHaveBeenCalledWith(heroes);
  });

  it('should filter heroes', () => {
    service.filterBy('spider');
    expect(storeSpy.setFilter).toHaveBeenCalledWith('spider');
  });

  it('should change page', () => {
    service.changePage(2);
    expect(storeSpy.setPage).toHaveBeenCalledWith(2);
  });

  it('should get hero by id', () => {
    const hero: Hero = { id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '' };
    storeSpy.heroes.and.returnValue([hero]);
    const result = service.getById('1');
    expect(result).toEqual(hero);
  });

  it('should handle error on loadAll', () => {
    repoSpy.findAll$.and.returnValue(throwError(() => new Error('fail')));
    service.loadAll();
    expect(service.lastError()).toContain('fail');
  });
});