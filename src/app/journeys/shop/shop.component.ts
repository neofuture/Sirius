import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {JsonPipe, NgForOf} from "@angular/common";
import {SectionComponent} from "../../components/section/section.component";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone: true,
  imports: [
    JsonPipe,
    NgForOf,
    SectionComponent,
    StandardHeaderComponent
  ]
})

export class ShopComponent {
  listing: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    title: Title,
  ) {
    this.listing = this.activatedRoute.snapshot.data["listingData"];
  }
}
