import { Injectable } from '@angular/core';
import { Hero,HeroId,Universe } from '../domain/hero.model';
import { delay, Observable, of, throwError } from 'rxjs';

const LATENCY = 300; 

@Injectable({
  providedIn: 'root'
})
export class HeroRepository {
private heroes: Hero[] = [
    { id: crypto.randomUUID(), name: 'BATMAN', powers:'Detective', universe: Universe.DC, alterEgo: 'Bruce Wayne',
      image:'https://statics.forbesargentina.com/2022/06/629f81fe391f3.jpg',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'SPIDERMAN', powers: 'Spider-sense', universe: Universe.MARVEL, alterEgo: 'Peter Parker',
      image:'https://www.shutterstock.com/image-vector/spiderman-art-design-icon-vector-600nw-2404385831.jpg',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  findAll$(): Observable<Hero[]> {
    return of([...this.heroes]).pipe(delay(LATENCY));
  }

  findById$(id: HeroId): Observable<Hero | undefined> {
    return of(this.heroes.find(h => h.id === id)).pipe(delay(LATENCY));
  }

  searchByName$(term: string): Observable<Hero[]> {
    const q = (term ?? '').trim().toLowerCase();
    const res = !q
      ? [...this.heroes]
      : this.heroes.filter(h => h.name.toLowerCase().includes(q));
    return of(res).pipe(delay(LATENCY));
  }

  create$(data: Omit<Hero, 'id'|'createdAt'|'updatedAt'>): Observable<Hero> {
    const now = new Date().toISOString();
    const hero: Hero = {
      ...data,
      id: crypto.randomUUID(),
      name: data.name.toUpperCase(),
      createdAt: now,
      updatedAt: now,
    };
    this.heroes = [...this.heroes, hero];
    return of(hero).pipe(delay(LATENCY));
  }

  update$(id: HeroId, changes: Partial<Hero>): Observable<Hero> {
    const index = this.heroes.findIndex(h => h.id === id);
    if (index < 0) {
      return throwError(() => new Error('Hero not found'));
    }
    const updated: Hero = {
      ...this.heroes[index],
      ...changes,
      name: (changes.name ?? this.heroes[index].name).toUpperCase(),
      id,
      updatedAt: new Date().toISOString(),
    };
    this.heroes = [...this.heroes.slice(0, index), updated, ...this.heroes.slice(index + 1)];
    return of(updated).pipe(delay(LATENCY));
  }

  remove$(id: HeroId): Observable<void> {
    this.heroes = this.heroes.filter(h => h.id !== id);
    return of(void 0).pipe(delay(LATENCY));
  }  
}
