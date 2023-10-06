import {Component, HostBinding} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {dynamicRoutes} from "../../dynamic-routes.routes";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ]
})

export class NavigationComponent {
  megaMenu: any = [];
  focusState = false;

  @HostBinding('class.navigation')
  protected readonly hbClass = true;
  constructor() {
    const menuMap = new Map();

    for (const route of dynamicRoutes) {
      if (route.position === 0) {
        route.categories = [];
        route.brands = [];
        menuMap.set(route.slug, {slug: route.slug, title: route.title, categories: route.categories, brands: route.brands, image: route.image});
      }
    }

    for (const route of dynamicRoutes) {
      if (route.position === 1 && route.menu && menuMap.has(route.menu)) {
        menuMap.get(route.menu).categories.push({slug: route.slug, title: route.title});
      } else if (route.position === 2 && route.menu && menuMap.has(route.menu)) {
        menuMap.get(route.menu).brands.push({slug: route.slug, title: route.title});
      }
    }

    this.megaMenu = Array.from(menuMap.values());
  }

  setMenuOpen() {
    this.focusState = true;
  }

  setMenuClosed() {
    this.focusState = false;
  }
}
