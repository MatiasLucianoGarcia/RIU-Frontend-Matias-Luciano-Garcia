import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesList } from './heroes-list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import 'zone.js';
import { provideZoneChangeDetection, signal } from '@angular/core';
import { HeroService } from '../../services/hero-service';
import { RouterTestingModule } from '@angular/router/testing';

import { Hero, Universe } from '../../domain/hero.model';

class MockHeroService {
  loadAll = jasmine.createSpy('loadAll');
  filterBy = jasmine.createSpy('filterBy');
  changePage = jasmine.createSpy('changePage');
  page = jasmine.createSpy('page').and.returnValue(1);
  totalPages = jasmine.createSpy('totalPages').and.returnValue(2);
  delete = jasmine.createSpy('delete');
  filter = () => '';
  heroes = (): Hero[] => [];
  loading = () => false;
}

describe('HeroesList', () => {
  let component: HeroesList;
  let fixture: ComponentFixture<HeroesList>;
  let svc: MockHeroService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroesList,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: HeroService, useClass: MockHeroService },
        provideZoneChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesList);
    component = fixture.componentInstance;
    svc = TestBed.inject(HeroService) as any;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to true and false correctly', () => {
    svc.loading = () => true;
    fixture = TestBed.createComponent(HeroesList);
    component = fixture.componentInstance;
    expect(component.loading()).toBeTrue();
    svc.loading = () => false;
    fixture = TestBed.createComponent(HeroesList);
    component = fixture.componentInstance;
    expect(component.loading()).toBeFalse();
  });

  it('should provide heroes data from service', () => {
    const heroesMock = [
      { id: '1', name: 'Hero 1', alterEgo: '', image: '', powers: '', universe: Universe.DC, createdAt: '', updatedAt: '' },
      { id: '2', name: 'Hero 2', alterEgo: '', image: '', powers: '', universe: Universe.DC, createdAt: '', updatedAt: '' }
    ];
    svc.heroes = () => heroesMock;
    fixture = TestBed.createComponent(HeroesList);
    component = fixture.componentInstance;
    expect(component.heroes()).toEqual(heroesMock);
  });

  it('should call loadAll on ngOnInit', () => {
    component.ngOnInit();
    expect(svc.loadAll).toHaveBeenCalled();
  });

  it('should call filterBy on onFilter', () => {
    component.onFilter('batman');
    expect(svc.filterBy).toHaveBeenCalledWith('batman');
  });

  it('should call changePage on prev', () => {
    svc.page.and.returnValue(2);
    component.prev();
    expect(svc.changePage).toHaveBeenCalledWith(1);
  });

  it('should call changePage on next', () => {
    svc.page.and.returnValue(1);
    component.next();
    expect(svc.changePage).toHaveBeenCalledWith(2);
  });

  it('should navigate to /heroes/new on goNew', () => {
    const spy = spyOn(router, 'navigate');
    component.goNew();
    expect(spy).toHaveBeenCalledWith(['/heroes/new']);
  });

  it('should navigate to /heroes/:id/edit on goEdit', () => {
    const spy = spyOn(router, 'navigate');
    component.goEdit('123');
    expect(spy).toHaveBeenCalledWith(['/heroes', '123', 'edit']);
  });

  it('should call delete on onDelete if confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete('123');
    expect(svc.delete).toHaveBeenCalledWith('123');
  });

  it('should not call delete on onDelete if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete('123');
    expect(svc.delete).not.toHaveBeenCalled();
  });
});