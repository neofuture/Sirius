import {Component, Inject, PLATFORM_ID} from "@angular/core";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {isPlatformBrowser, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {LoadingComponent} from "../../../components/loading/loading.component";
import {SectionComponent} from "../../../components/section/section.component";
import {SanitiseUrlPipe} from "../../../pipes/sanitise-url.pipe";
import {StoredSearch} from "../../../models/stored-search.interface";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    JsonPipe,
    LoadingComponent,
    NgIf,
    SectionComponent,
    RouterLink,
    NgForOf,
    SanitiseUrlPipe
  ]
})

export class CategoryComponent {
  slugs!: string[];
  loaded = false;
  loadingText = 'Loading';
  listings: StoredSearch[] | [] | undefined;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    route: ActivatedRoute,
    private httpClient: HttpClient,
  ) {
    if (isPlatformBrowser(platformId)) {
      this.slugs = route.snapshot.url.map(({path}) => path);
      this.loaded = false;
      this.loadingText = 'Loading';
      setTimeout(() => {
        this.loadingText = 'Still loading';
      }, 3000);
      setTimeout(() => {
        this.loadingText = 'Please wait. Still loading';
      }, 8000);

      this.httpClient.get(environment.api + '/search?stored_search=' + this.slugs[0]).subscribe((data: any) => {
        this.listings = data.data.listings;
        this.loaded = true;
      });
    }
  }
}
