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
  
  it('should render placeholder image if hero.image is empty', () => {
    const newHero: Hero = {
      id: '2',
      name: 'No Image',
      alterEgo: 'Alter',
      image: '',
      powers: 'Power',
      universe: Universe.DC,
      createdAt: '',
      updatedAt: ''
    };
    fixture.componentRef.setInput('hero', newHero);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img?.getAttribute('src')).toContain('hero-default.png');
  });
  
  it('should update hero input and reflect changes', () => {
    const updatedHero: Hero = {
      id: '1',
      name: 'Updated Hero',
      alterEgo: 'Updated AlterEgo',
      image: '',
      powers: 'Updated Power',
      universe: Universe.MARVEL,
      createdAt: '',
      updatedAt: ''
    };
    fixture.componentRef.setInput('hero', updatedHero);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Updated Hero');
    expect(compiled.querySelector('mat-card-subtitle')?.textContent).toContain('Updated AlterEgo');
  });

    it('should render hero image with correct src', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const img = compiled.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('../../../../../assets/images/hero-default.png');
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

    it('should change the src if the image is not hero-default.png', () => {
      const event = {
        target: { src: 'algo.png' }
      } as unknown as Event;
      component.onImgError(event);
      expect((event.target as HTMLImageElement).src).toContain('hero-default.png');
    });

  it('should not change the src if the image is already hero-default.png', () => {
    const event = {
      target: { src: '../../../../../assets/images/hero-default.png' }
    } as unknown as Event;
    component.onImgError(event);
    expect((event.target as HTMLImageElement).src).toBe('../../../../../assets/images/hero-default.png');
  });

});
