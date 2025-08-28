import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero-service';
import { HeroStore } from '../state/hero-store';
import { HeroRepository } from '../data/hero-repository';
import { of, throwError } from 'rxjs';
import { EMPTY } from 'rxjs';
import { Hero, Universe } from '../domain/hero.model';

describe('HeroService', () => {
    it('should call setLoading(false) on create success', () => {
      const hero: Hero = { id: '1', name: 'X', universe: Universe.DC, createdAt: '', updatedAt: '', alterEgo: 'Y', powers: '', image: '' };
      repoSpy.create$.and.returnValue(of(hero));
      const spy = storeSpy.setLoading;
      service.create({ name: 'X', alterEgo: 'Y', powers: '', universe: Universe.DC, image: '' });
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call setLoading(false) on create error', () => {
      repoSpy.create$.and.returnValue(throwError(() => new Error('fail')));
      const spy = storeSpy.setLoading;
      service.create({ name: 'X', alterEgo: 'Y', powers: '', universe: Universe.DC, image: '' });
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call setLoading(false) on update success', () => {
      const hero: Hero = { id: '1', name: 'Y', universe: Universe.DC, createdAt: '', updatedAt: '', alterEgo: '', powers: '', image: '' };
      repoSpy.update$.and.returnValue(of(hero));
      const spy = storeSpy.setLoading;
      service.update('1', { name: 'Y' });
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call setLoading(false) on update error', () => {
      repoSpy.update$.and.returnValue(throwError(() => new Error('fail')));
      const spy = storeSpy.setLoading;
      service.update('1', { name: 'Y' });
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call setLoading(false) on delete success', () => {
      repoSpy.remove$.and.returnValue(of(void 0));
      const spy = storeSpy.setLoading;
      service.delete('1');
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call setLoading(false) on delete error', () => {
      repoSpy.remove$.and.returnValue(throwError(() => new Error('fail')));
      const spy = storeSpy.setLoading;
      service.delete('1');
      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should handle EMPTY observable in create', () => {
  // Observable que no emite ni next ni error
  repoSpy.create$.and.returnValue(EMPTY);
  service.create({ name: 'X', alterEgo: 'Y', powers: '', universe: Universe.DC, image: '' });
  expect(storeSpy.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle null value in create', () => {
      repoSpy.create$.and.returnValue(of(null as any));
      spyOn(service, 'loadAll');
      service.create({ name: 'X', alterEgo: 'Y', powers: '', universe: Universe.DC, image: '' });
      expect(service.loadAll).toHaveBeenCalled();
      expect(storeSpy.setLoading).toHaveBeenCalledWith(false);
    });
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
    repoSpy.findAll$.and.returnValue(of([]));
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

    it('should return undefined if getById does not find hero', () => {
      storeSpy.heroes.and.returnValue([]);
      const result = service.getById('no-id');
      expect(result).toBeUndefined();
    });

    it('should call changePageSize', () => {
      service.changePageSize(10);
      expect(storeSpy.setPageSize).toHaveBeenCalledWith(10);
    });

    it('should call delete and handle error', () => {
      repoSpy.remove$.and.returnValue(throwError(() => new Error('delete error')));
      service.delete('1');
      expect(storeSpy.setLoading).toHaveBeenCalledWith(true);
      expect(service.lastError()).toContain('delete error');
    });

    it('should call create and handle success', () => {
  repoSpy.findAll$.and.returnValue(of([]));
  const hero: Hero = { id: '1', name: 'Batman', universe: Universe.DC, createdAt: '', updatedAt: '', alterEgo: 'Bruce Wayne', powers: '', image: '' };
  repoSpy.create$.and.returnValue(of(hero));
      spyOn(service, 'loadAll');
      service.create({ name: 'Batman', alterEgo: 'Bruce Wayne', powers: '', universe: Universe.DC, image: '' });
      expect(storeSpy.setLoading).toHaveBeenCalledWith(true);
      expect(service.loadAll).toHaveBeenCalled();
      expect(service.lastError()).toBeNull();
    });

    it('should call update and handle success', () => {
  repoSpy.findAll$.and.returnValue(of([]));
  const hero: Hero = { id: '1', name: 'Spiderman', universe: Universe.DC, createdAt: '', updatedAt: '', alterEgo: '', powers: '', image: '' };
  repoSpy.update$.and.returnValue(of(hero));
      spyOn(service, 'loadAll');
      service.update('1', { name: 'Spiderman' });
      expect(storeSpy.setLoading).toHaveBeenCalledWith(true);
      expect(service.loadAll).toHaveBeenCalled();
      expect(service.lastError()).toBeNull();
    });

    it('should call delete and handle success', () => {
  repoSpy.findAll$.and.returnValue(of([]));
  repoSpy.findAll$.and.returnValue(of([]));
  repoSpy.remove$.and.returnValue(of(void 0));
      spyOn(service, 'loadAll');
      service.delete('1');
      expect(storeSpy.setLoading).toHaveBeenCalledWith(true);
      expect(service.loadAll).toHaveBeenCalled();
      expect(service.lastError()).toBeNull();
    });

    it('should call create and handle error', () => {
  repoSpy.findAll$.and.returnValue(of([]));
      repoSpy.create$.and.returnValue(throwError(() => new Error('create error')));
      service.create({ name: 'Batman', alterEgo: 'Bruce Wayne', powers: '', universe: Universe.DC, image: '' });
      expect(storeSpy.setLoading).toHaveBeenCalledWith(true);
      expect(service.lastError()).toContain('create error');
    });

    it('should call update and handle error', () => {
  repoSpy.findAll$.and.returnValue(of([]));
  repoSpy.findAll$.and.returnValue(of([]));
      repoSpy.update$.and.returnValue(throwError(() => new Error('update error')));
      service.update('1', { name: 'Batman' });
      expect(storeSpy.setLoading).toHaveBeenCalledWith(true);
      expect(service.lastError()).toContain('update error');
    });

    it('should call delete and handle error', () => {
      repoSpy.remove$.and.returnValue(throwError(() => new Error('delete error')));
      service.delete('1');
      expect(storeSpy.setLoading).toHaveBeenCalledWith(true);
      expect(service.lastError()).toContain('delete error');
    });
    
    it('should handle error on loadAll', () => {
      repoSpy.findAll$.and.returnValue(throwError(() => new Error('fail')));
      service.loadAll();
      expect(service.lastError()).toContain('fail');
    });
});