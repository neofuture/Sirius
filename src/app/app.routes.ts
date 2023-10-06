import { Routes } from '@angular/router';
import {CategoryRouteGuard} from "./guards/category.guard";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./journeys/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'sell',
    loadComponent: () => import('./journeys/sell/sell.component').then(m => m.SellComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./journeys/search/search.component').then(m => m.SearchComponent),
  },
  {
    path: 'item/:item/:slug',
    loadComponent: () => import('./journeys/item/item.component').then(m => m.ItemComponent),
  },
  {
    path: ':dynamicPath',
    canActivate: [CategoryRouteGuard],
    loadComponent: () => import('./journeys/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: ':dynamicPath/:subDynamicPath',
    canActivate: [CategoryRouteGuard],
    loadComponent: () => import('./journeys/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: ':dynamicPath/:subDynamicPath/:subSubDynamicPath',
    canActivate: [CategoryRouteGuard],
    loadComponent: () => import('./journeys/landing/landing.component').then(m => m.LandingComponent),
  }
];
