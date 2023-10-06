import {Component} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {LoadingComponent} from "../../../components/loading/loading.component";
import {JsonPipe, NgIf} from "@angular/common";
import {SectionComponent} from "../../../components/section/section.component";

@Component({
  selector: 'app-automotive',
  templateUrl: './automotive.component.html',
  styleUrls: ['./automotive.component.css'],
  imports: [
    LoadingComponent,
    JsonPipe,
    NgIf,
    SectionComponent
  ],
  standalone: true
})

export class AutomotiveComponent {
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
        this.json = data.data;
        this.loaded = true;
      });
    }


}
