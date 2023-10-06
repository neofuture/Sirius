import {Component} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
  imports: [
    SectionComponent,
    StandardHeaderComponent
  ],
  standalone: true
})

export class SellComponent {

}
