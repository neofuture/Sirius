import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {ListingsService} from "../services/listings.service";
import {inject} from "@angular/core";
import {catchError, Observable, of} from "rxjs";

export const ShopResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, listingService: ListingsService = inject(ListingsService)
): Observable<{}> => {
  let slugs = route.url.map(({path}) => path);
  return listingService
    .getShop(slugs[1])
    .pipe(catchError((err) => {
        return of('No data' + err);
      })
    );
}
