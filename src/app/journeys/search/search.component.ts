import {Component} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";
import {ActivatedRoute, Params} from "@angular/router";
import {HttpClient, HttpClientModule, JsonpClientBackend} from "@angular/common/http";
import {JsonPipe, NgIf} from "@angular/common";
import {environment} from "../../../environments/environment";
import {LoadingComponent} from "../../components/loading/loading.component";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [
    SectionComponent,
    StandardHeaderComponent,
    HttpClientModule,
    JsonPipe,
    LoadingComponent,
    NgIf
  ],
  standalone: true
})

export class SearchComponent {
  params: Params;
  loaded: boolean | undefined;
  loadingText: string | undefined;
  json: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
  ) {
    this.params = this.activatedRoute.snapshot.queryParams;
    if(this.params["search"].length > 0){
      this.loaded = false;
      this.loadingText = 'Loading';
      setTimeout(() => {
        this.loadingText = 'Still loading';
      }, 3000);
      setTimeout(() => {
        this.loadingText = 'Please wait. Still loading';
      }, 8000);
      this.httpClient.get(
        environment.api + `/search?active_listings=1&cat_id=${this.params["cat_id"]}&category=${this.params["category"]}&page=1&results_per_page=20&search=` + this.params["search"])
        .subscribe((data: any) => {
        this.json = data.data.listings;
        this.loaded = true;
      });
    }
  }
}
