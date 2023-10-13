import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import {dynamicRoutes} from "../dynamic-routes.routes";

@Injectable({
  providedIn: 'root'
})
export class CategoryRouteGuard {

  validPaths: string[] = []

  constructor(private router: Router) {
    for(let item of dynamicRoutes){
      this.validPaths.push(item.slug);
    }
  }

  canActivate = (route: ActivatedRouteSnapshot): boolean => {
    const dynamicPath = route.params['dynamicPath'];

    if (this.validPaths.includes(dynamicPath)) {
      return true;
    } else {
      this.router.navigate(['/']).then();
      return false;
    }
  };
}
