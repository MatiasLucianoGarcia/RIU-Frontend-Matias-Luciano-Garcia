import { TestBed } from '@angular/core/testing';

import { HeroRepository } from './hero-repository';
import { Universe } from '../domain/hero.model';

describe('HeroRepository', () => {
  let service: HeroRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('findAll$ should return all heroes', (done) => {
    service.findAll$().subscribe(heroes => {
      expect(Array.isArray(heroes)).toBeTrue();
      expect(heroes.length).toBeGreaterThan(0);
      done();
    });
  });

  it('findById$ should return a hero by id', (done) => {
    service.findAll$().subscribe(heroes => {
      const id = heroes[0].id;
      service.findById$(id).subscribe(hero => {
        expect(hero).toBeTruthy();
        expect(hero?.id).toBe(id);
        done();
      });
    });
  });

  it('searchByName$ should find hero by name', (done) => {
    service.searchByName$('batman').subscribe(heroes => {
      expect(heroes.length).toBeGreaterThan(0);
      expect(heroes[0].name).toContain('BATMAN');
      done();
    });
  });

  it('create$ should add a new hero', (done) => {
    const newHero = {
      name: 'SUPERMAN',
      powers: 'Super strength',
      universe: Universe.DC,
      alterEgo: 'Clark Kent',
      image: '',
    };
    service.create$(newHero).subscribe(hero => {
      expect(hero.name).toBe('SUPERMAN');
      service.findAll$().subscribe(heroes => {
        expect(heroes.some(h => h.name === 'SUPERMAN')).toBeTrue();
        done();
      });
    });
  });

  it('update$ should modify an existing hero', (done) => {
    service.findAll$().subscribe(heroes => {
      const hero = heroes[0];
      service.update$(hero.id, { name: 'BATMAN MOD' }).subscribe(updated => {
        expect(updated.name).toBe('BATMAN MOD');
        done();
      });
    });
  });

  it('remove$ should delete a hero', (done) => {
    service.findAll$().subscribe(heroes => {
      const id = heroes[0].id;
      service.remove$(id).subscribe(() => {
        service.findById$(id).subscribe(hero => {
          expect(hero).toBeUndefined();
          done();
        });
      });
    });
  });

    it('update$ should throw error if hero not found', (done) => {
      service.update$('no-id', { name: 'X' }).subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeTruthy();
          expect(err.message).toContain('Hero not found');
          done();
        }
      });
    });

    it('searchByName$ should return all heroes if term is empty', (done) => {
      service.findAll$().subscribe(allHeroes => {
        service.searchByName$('').subscribe(heroes => {
          expect(heroes.length).toBe(allHeroes.length);
          done();
        });
      });
    });

    it('searchByName$ should return empty array if no match', (done) => {
      service.searchByName$('no-match').subscribe(heroes => {
        expect(heroes.length).toBe(0);
        done();
      });
    });

    it('remove$ should not fail for non-existent id', (done) => {
      service.findAll$().subscribe(heroesBefore => {
        service.remove$('no-id').subscribe(() => {
          service.findAll$().subscribe(heroesAfter => {
            expect(heroesAfter.length).toBe(heroesBefore.length);
            done();
          });
        });
      });
    });

    it('findById$ should return undefined for non-existent id', (done) => {
      service.findById$('no-id').subscribe(hero => {
        expect(hero).toBeUndefined();
        done();
      });
    });

    it('create$ should handle missing required fields', (done) => {
      service.create$({ name: '', powers: '', universe: Universe.DC, alterEgo: '', image: '' }).subscribe(hero => {
        expect(hero.name).toBe('');
        done();
      });
    });

    it('remove$ should not fail for non-existent id', (done) => {
      service.remove$('no-id').subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });
});
