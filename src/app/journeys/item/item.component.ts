import {Component} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {ActivatedRoute} from "@angular/router";
import {JsonPipe, NgIf} from "@angular/common";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";
import {Title} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {LoadingComponent} from "../../components/loading/loading.component";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  imports: [
    SectionComponent,
    JsonPipe,
    StandardHeaderComponent,
    NgIf,
    LoadingComponent
  ],
  standalone: true
})

export class ItemComponent {
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
    this.comp = this.slugs.shift();
    this.loaded = false;
    this.loadingText = 'Loading';
    setTimeout(() => {
      this.loadingText = 'Still loading';
    }, 3000);
    setTimeout(() => {
      this.loadingText = 'Please wait. Still loading';
    }, 8000);
    this.httpClient.get(environment.api + '/listing/' + this.slugs[0] + '?with[]=all').subscribe((data: any) => {
      this.json = data.data;
      this.title.setTitle(data.data.title.replace(/&amp;/ , '&'));
      this.loaded = true;
    });
  }
}
