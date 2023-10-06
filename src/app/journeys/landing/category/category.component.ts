import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Title} from "@angular/platform-browser";
import {JsonPipe, NgIf} from "@angular/common";
import {LoadingComponent} from "../../../components/loading/loading.component";
import {SectionComponent} from "../../../components/section/section.component";

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
    SectionComponent
  ]
})

export class CategoryComponent {
  slugs!: string[];
  json: any;
  comp: string | undefined;
  loaded = false;
  loadingText = 'Loading';

  constructor(
    route: ActivatedRoute,
    private httpClient: HttpClient,
    private title: Title
  ) {
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
      this.json = data.data.listings;
      this.loaded = true;
    });
  }
}
