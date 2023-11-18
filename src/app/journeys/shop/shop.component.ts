import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {JsonPipe, NgForOf} from "@angular/common";
import {SectionComponent} from "../../components/section/section.component";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";
import {ShopIneterface} from "../../models/shop.interface";
import {StandardFooterComponent} from "../../partials/standard-footer/standard-footer.component";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone: true,
  imports: [
    JsonPipe,
    NgForOf,
    SectionComponent,
    StandardHeaderComponent,
    StandardFooterComponent
  ]
})

export class ShopComponent {
  listing: ShopIneterface;
  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.listing = this.activatedRoute.snapshot.data["listingData"];
  }
}
