import {Component} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {ActivatedRoute} from "@angular/router";
import {JsonPipe, NgIf} from "@angular/common";
import {dynamicRoutes} from "../../dynamic-routes.routes";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";
import {Title} from "@angular/platform-browser";
import {AutomotiveComponent} from "./automotive/automotive.component";
import {CategoryComponent} from "./category/category.component";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  imports: [
    SectionComponent,
    JsonPipe,
    StandardHeaderComponent,
    AutomotiveComponent,
    CategoryComponent,
    NgIf
  ],
  standalone: true
})

export class LandingComponent {
  slugs: string[];
  mapping: string | undefined;
  constructor(
    route: ActivatedRoute,
    private title: Title
  ) {
    this.slugs = route.snapshot.url.map(({path}) => path);
    for(let item of dynamicRoutes) {
      if(item.slug === this.slugs[0]) {
        this.mapping = item.mapping;
        this.title.setTitle(environment.siteName + ' - ' + item.title.replace(/&amp;/ , '&'));
      }
    }
  }
}
