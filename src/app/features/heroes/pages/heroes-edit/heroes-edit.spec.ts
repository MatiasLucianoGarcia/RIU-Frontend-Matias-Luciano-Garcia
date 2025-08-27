import { TestBed } from '@angular/core/testing';
import { HeroesEdit } from './heroes-edit';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroService } from '../../services/hero-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Universe, Hero } from '../../domain/hero.model';

class MockHeroService {
  getById = jasmine.createSpy('getById');
  create = jasmine.createSpy('create');
  update = jasmine.createSpy('update');
}

describe('HeroesEdit', () => {
  let component: HeroesEdit;
  let svc: MockHeroService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesEdit, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: HeroService, useClass: MockHeroService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
      ],
    }).compileComponents();
    component = TestBed.createComponent(HeroesEdit).componentInstance;
    svc = TestBed.inject(HeroService) as any;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in edit mode if id exists', () => {
    const hero: Hero = { id: '1', name: 'A', universe: Universe.MARVEL, createdAt: '', updatedAt: '', alterEgo: 'Alter', powers: 'Power', image: 'img' };
    svc.getById.and.returnValue(hero);
    (route.snapshot.paramMap as any).get = () => '1';
    component.ngOnInit();
    expect(component.isEdit).toBeTrue();
    expect(component.form.value.name).toBe('A');
    expect(component.form.value.alterEgo).toBe('Alter');
    expect(component.form.value.power).toBe('Power');
    expect(component.form.value.universe).toBe(Universe.MARVEL);
    expect(component.form.value.imageUrl).toBe('img');
  });

  it('should navigate back with goBack', () => {
    const spy = spyOn(router, 'navigate');
    component.goBack();
    expect(spy).toHaveBeenCalledWith(['/heroes']);
  });

  it('should call create on submit if not edit', () => {
    component.isEdit = false;
  component.form.setValue({ name: 'AA', alterEgo: 'BB', power: '', universe: Universe.DC, imageUrl: '' });
    component.form.markAsDirty();
    component.form.markAllAsTouched();
    component.form.updateValueAndValidity();
    const spy = spyOn(component, 'goBack');
    component.onSubmit();
    expect(svc.create).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should call update on submit if edit', () => {
    component.isEdit = true;
    component.heroId = '1';
  component.form.setValue({ name: 'AA', alterEgo: 'BB', power: '', universe: Universe.DC, imageUrl: '' });
    component.form.markAsDirty();
    component.form.markAllAsTouched();
    component.form.updateValueAndValidity();
    const spy = spyOn(component, 'goBack');
    component.onSubmit();
    expect(svc.update).toHaveBeenCalledWith('1', jasmine.any(Object));
    expect(spy).toHaveBeenCalled();
  });

});
// import { ComponentFixture, TestBed } from '@angular/core/testing';


// import { HeroesEdit } from './heroes-edit';
// import { Hero, Universe } from '../../domain/hero.model';
// import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap, Router } from '@angular/router';
// import { HeroService } from '../../services/hero-service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NgZone, provideZoneChangeDetection, ɵChangeDetectionScheduler } from '@angular/core';

//   describe('HeroesEdit', () => {
//     let component: HeroesEdit;
//     let fixture: ComponentFixture<HeroesEdit>;
//     let heroServiceSpy: jasmine.SpyObj<HeroService>;
//     let routerSpy: jasmine.SpyObj<Router>;
//     let activatedRouteStub: Partial<ActivatedRoute>;

//     beforeEach(async () => {
//       heroServiceSpy = jasmine.createSpyObj('HeroService', ['getById', 'update', 'create']);
//       routerSpy = jasmine.createSpyObj('Router', ['navigate']);
//       const paramMapStub: ParamMap = {
//         keys: [],
//         get: (name: string) => null,
//         getAll: (name: string) => [],
//         has: (name: string) => false
//       };
//       activatedRouteStub = {
//         snapshot: {
//           paramMap: paramMapStub,
//           url: [],
//           params: {},
//           queryParams: {},
//           fragment: null,
//           data: {},
//           outlet: '',
//           component: null,
//           routeConfig: null,
//           title: undefined,
//           root: new ActivatedRouteSnapshot,
//           parent: null,
//           firstChild: null,
//           children: [],
//           pathFromRoot: [],
//           queryParamMap: paramMapStub
//         }
//       };

//       await TestBed.configureTestingModule({
//         imports: [HeroesEdit, ReactiveFormsModule],
//         providers: [
//           provideZoneChangeDetection(),
//           { provide: HeroService, useValue: heroServiceSpy },
//           { provide: Router, useValue: routerSpy },
//           { provide: ActivatedRoute, useValue: activatedRouteStub },
//         ]
//       }).compileComponents();

//       fixture = TestBed.createComponent(HeroesEdit);
//       component = fixture.componentInstance;
//       fixture.detectChanges();
//     });

//     it('should create', () => {
//       expect(component).toBeTruthy();
//     });

//   });
  