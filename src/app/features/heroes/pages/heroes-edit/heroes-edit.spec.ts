import { TestBed } from '@angular/core/testing';
import { HeroesEdit } from './heroes-edit';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroService } from '../../services/hero-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Universe, Hero } from '../../domain/hero.model';



describe('HeroesEdit', () => {
  let component: HeroesEdit;
  let svc: any;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesEdit, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: HeroService, useValue: jasmine.createSpyObj('HeroService', ['getById', 'create', 'update']) },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
      ],
    }).compileComponents();
  component = TestBed.createComponent(HeroesEdit).componentInstance;
  svc = TestBed.inject(HeroService);
  svc.create.and.callFake(() => {});
  svc.update.and.callFake(() => {});
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

    it('should not submit if form is invalid', () => {
      component.isEdit = false;
      component.form.setValue({ name: '', alterEgo: '', power: '', universe: Universe.OTHER, imageUrl: '' });
      // Solo espía si no está ya espiado
      if (!svc.create.calls) spyOn(svc, 'create');
      if (!svc.update.calls) spyOn(svc, 'update');
      component.onSubmit();
      expect(svc.create).not.toHaveBeenCalled();
      expect(svc.update).not.toHaveBeenCalled();
    });

    it('should initialize form in create mode if no id', () => {
      (route.snapshot.paramMap as any).get = () => null;
      component.ngOnInit();
      expect(component.isEdit).toBeFalse();
    });

      it('should go back if hero not found in edit mode', () => {
        const spy = spyOn(component, 'goBack');
        (route.snapshot.paramMap as any).get = () => 'not-exist';
        svc.getById.and.returnValue(undefined);
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
      });

      it('should call update if form is valid and in edit mode', () => {
        component.isEdit = true;
        component.heroId = '1';
        component.form.setValue({ name: 'Batman', alterEgo: 'Bruce Wayne', power: 'Detective', universe: Universe.DC, imageUrl: 'img' });
        component.form.markAsDirty();
        component.form.markAllAsTouched();
        component.form.updateValueAndValidity();
        svc.update.and.callFake(() => {});
        component.onSubmit();
        expect(svc.update).toHaveBeenCalledWith('1', jasmine.any(Object));
      });

      it('should call create if form is valid and not in edit mode', () => {
        component.isEdit = false;
        component.form.setValue({ name: 'AA', alterEgo: 'BB', power: '', universe: Universe.DC, imageUrl: '' });
        component.form.markAsDirty();
        component.form.markAllAsTouched();
        component.form.updateValueAndValidity();
        svc.create.and.callFake(() => {});
        component.onSubmit();
        expect(svc.create).toHaveBeenCalledWith(jasmine.any(Object));
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

    it('should not patch or preview if no file selected', async () => {
      const spyPatch = spyOn(component.form, 'patchValue');
      const spyPreview = spyOn(component.preview, 'set');
      const event = { target: { files: undefined } } as any;
      await component.onFileSelected(event);
      expect(spyPatch).not.toHaveBeenCalled();
      expect(spyPreview).not.toHaveBeenCalled();
    });

    it('should handle error in resizeToDataURL (FileReader error)', async () => {
      const file = new Blob(['test'], { type: 'image/jpeg' });
      const fakeFile = new File([file], 'test.jpg');
      spyOn(window, 'FileReader').and.returnValue({
        readAsDataURL: function() { this.onerror(); },
        addEventListener: () => {},
        onload: null,
        onerror: null,
        result: null
      } as any);
      await expectAsync(component['resizeToDataURL'](fakeFile, 600, 600)).toBeRejected();
    });

    it('should handle error in resizeToDataURL (Image error)', async () => {
      const file = new Blob(['test'], { type: 'image/jpeg' });
      const fakeFile = new File([file], 'test.jpg');
      spyOn(window, 'FileReader').and.returnValue({
        readAsDataURL: function() { this.onload(); },
        addEventListener: () => {},
        onload: null,
        onerror: null,
        result: 'data:image/jpeg;base64,'
      } as any);
      spyOn(window, 'Image').and.returnValue({
        set src(val: any) { setTimeout(() => this.onerror(), 0); },
        onload: null,
        onerror: null
      } as any);
      await expectAsync(component['resizeToDataURL'](fakeFile, 600, 600)).toBeRejected();
    });

    it('should patch form with null/undefined values', () => {
      const hero: any = { name: 'A', alterEgo: 'B', powers: null, universe: undefined, image: undefined };
      svc.getById.and.returnValue(hero);
      (route.snapshot.paramMap as any).get = () => '1';
      component.ngOnInit();
      expect(component.form.value.power).toBe('');
      expect(component.form.value.universe).toBeNull();
      expect(component.form.value.imageUrl).toBeUndefined();
    });

    it('should submit with optional values', () => {
  component.isEdit = false;
  component.form.setValue({ name: 'Hero', alterEgo: 'Back', power: '', universe: Universe.OTHER, imageUrl: '../../../../../assets/images/hero-default.png' });
  component.form.markAsDirty();
  component.form.markAllAsTouched();
  component.form.updateValueAndValidity();
  svc.create.and.callFake(() => {});
  const spy = spyOn(component, 'goBack');
  component.onSubmit();
  expect(svc.create).toHaveBeenCalledWith(jasmine.objectContaining({ power: '', universe: 'OTHER', image: '../../../../../assets/images/hero-default.png' }));
  expect(spy).toHaveBeenCalled();
    });

});