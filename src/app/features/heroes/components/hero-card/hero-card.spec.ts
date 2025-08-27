
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCard } from './hero-card';
import { provideZoneChangeDetection } from '@angular/core';
import { Hero, Universe } from '../../domain/hero.model';

describe('HeroCard', () => {
  let component: HeroCard;
  let fixture: ComponentFixture<HeroCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCard],
      providers: [
        provideZoneChangeDetection(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroCard);
    component = fixture.componentInstance;
    const newHero: Hero ={
      id: '1',
      name: 'Test Hero',
      alterEgo: 'Test AlterEgo',
      image: '',
      powers: 'Test Power',
      universe: Universe.MARVEL,
      createdAt: '',
      updatedAt: ''
    };
    fixture.componentRef.setInput('hero', newHero);
    console.log(component)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
    it('should render hero name, alterEgo and powers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Test Hero');
      expect(compiled.querySelector('mat-card-subtitle')?.textContent).toContain('Test AlterEgo');
    });

    it('should render hero image with correct src', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const img = compiled.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('https://i.pinimg.com/1200x/a9/a8/c8/a9a8c8258957c8c7d6fcd320e9973203.jpg');
      expect(img?.getAttribute('alt')).toContain('Photo of');
    });

    it('should emit onEditClick when Edit button is clicked', () => {
      spyOn(component.onEditClick, 'emit');
      const compiled = fixture.nativeElement as HTMLElement;
      const editBtn = compiled.querySelector('button[color="primary"]') as HTMLElement;
      editBtn?.click();
      expect(component.onEditClick.emit).toHaveBeenCalled();
    });

    it('should emit onDeleteClick when Delete button is clicked', () => {
      spyOn(component.onDeleteClick, 'emit');
      const compiled = fixture.nativeElement as HTMLElement;
      const deleteBtn = compiled.querySelector('button[color="warn"]') as HTMLElement;
      deleteBtn?.click();
      expect(component.onDeleteClick.emit).toHaveBeenCalled();
    });
});
