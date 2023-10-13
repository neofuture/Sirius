import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {ListingsService} from "../services/listings.service";
import {inject} from "@angular/core";
import {catchError, Observable, of} from "rxjs";

export const HomeResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, listingService: ListingsService = inject(ListingsService)
): Observable<{}> => {
  return listingService
    .getHome()
    .pipe(catchError((err) => {
        return of('No data' + err);
      })
    );
}
