import { Routes } from "@angular/router";
import { HeroesList } from "../heroes/pages/heroes-list/heroes-list";
import { HeroesEdit } from "./pages/heroes-edit/heroes-edit";

export const HEROES_ROUTES :Routes = [
    {
        path: '',
        loadComponent:() => import('../heroes/pages/heroes-list/heroes-list').then(c => HeroesList)
    },
    {
        path: 'new',
        loadComponent:() => import('../heroes/pages/heroes-edit/heroes-edit').then(c => HeroesEdit)
    },
    {
        path: ':id/edit',
        loadComponent: () =>import('../heroes/pages/heroes-edit/heroes-edit').then(c => HeroesEdit)
  },
    
] 