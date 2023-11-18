import {Routes} from '@angular/router';
import {CategoryRouteGuard} from "./guards/category.guard";
import {HomeResolver} from "./resolvers/home.resolver";
import {ItemResolver} from "./resolvers/item.resolver";
import {ShopResolver} from "./resolvers/shop.resolver";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./journeys/home/home.component').then(m => m.HomeComponent),
    resolve: {listingData: HomeResolver}
  },
  {
    path: 'about',
    loadComponent: () => import('./journeys/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'faq',
    loadComponent: () => import('./journeys/faq/faq.component').then(m => m.FaqComponent),
  },
  {
    path: 'fees',
    loadComponent: () => import('./journeys/fees/fees.component').then(m => m.FeesComponent),
  },
  {
    path: 'prohibited',
    loadComponent: () => import('./journeys/prohibited/prohibited.component').then(m => m.ProhibitedComponent),
  },
  {
    path: 'terms',
    loadComponent: () => import('./journeys/terms/terms.component').then(m => m.TermsComponent),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./journeys/privacy/privacy.component').then(m => m.PrivacyComponent),
  },
  {
    path: 'cookies',
    loadComponent: () => import('./journeys/cookies/cookies.component').then(m => m.CookiesComponent),
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
    path: '404',
    loadComponent: () => import('./journeys/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: 'item/:item/:slug',
    loadComponent: () => import('./journeys/item/item.component').then(m => m.ItemComponent),
    resolve: {listingData: ItemResolver}
  },
  {
    path: 'shop/:shopName',
    loadComponent: () => import('./journeys/shop/shop.component').then(m => m.ShopComponent),
    resolve: {listingData: ShopResolver}
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
