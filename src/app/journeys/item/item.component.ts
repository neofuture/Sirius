import {Component} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {ActivatedRoute} from "@angular/router";
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {LoadingComponent} from "../../components/loading/loading.component";
import {ItemInterface} from "../../models/item.interface";
import {StandardFooterComponent} from "../../partials/standard-footer/standard-footer.component";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
    imports: [
        SectionComponent,
        JsonPipe,
        AsyncPipe,
        StandardHeaderComponent,
        NgIf,
        LoadingComponent,
        NgForOf,
        StandardFooterComponent
    ],
  standalone: true
})

export class ItemComponent {
  listing: ItemInterface | undefined;
  constructor(
    private activatedRoute: ActivatedRoute,
    private title: Title,
  ) {
    this.listing = this.activatedRoute.snapshot.data["listingData"];
    if(this.listing){
      this.title.setTitle(environment.siteName + ' - ' + this.listing?.data?.title);
    }
  }
}
