import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ListingsService  {
  constructor(
    private http: HttpClient
  ) {
  }

  getListing(id: string): any {
    return this.http.get(environment.api + '/listing/' + id + '?with[]=all');
  }

  getHome(): any {
    return this.http.get(environment.api + '/home_page');
  }
}
