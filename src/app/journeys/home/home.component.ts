import {Component} from "@angular/core";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";
import {SectionComponent} from "../../components/section/section.component";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {JsonPipe, NgForOf} from "@angular/common";
import {SanitiseUrlPipe} from "../../pipes/sanitise-url.pipe";
import {CarouselComponent} from "../../components/carousel/carousel.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    StandardHeaderComponent,
    SectionComponent,
    JsonPipe,
    NgForOf,
    SanitiseUrlPipe,
    CarouselComponent
  ],
  standalone: true
})

export class HomeComponent {
  listings: any;

  slides = [
    {img: '/assets/images/banners/banner1.jpg'},
    {img: '/assets/images/banners/banner2.jpg'},
    {img: '/assets/images/banners/banner1.jpg'},
    {img: '/assets/images/banners/banner2.jpg'},
    {img: '/assets/images/banners/banner1.jpg'},
    {img: '/assets/images/banners/banner2.jpg'},
    {img: '/assets/images/banners/banner1.jpg'},
    {img: '/assets/images/banners/banner2.jpg'},
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private title: Title,
  ) {
    this.listings = this.activatedRoute.snapshot.data["listingData"].data;
    this.title.setTitle(environment.siteName + ' - Home');
  }
}
