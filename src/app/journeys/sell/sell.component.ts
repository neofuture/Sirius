import {Component} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";
import {ListingComponent} from "../../components/listing/listing.component";
import {StandardFooterComponent} from "../../partials/standard-footer/standard-footer.component";

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
    imports: [
        SectionComponent,
        StandardHeaderComponent,
        ListingComponent,
        StandardFooterComponent
    ],
  standalone: true
})

export class SellComponent {
}
