import {Component} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {StandardFooterComponent} from "../../partials/standard-footer/standard-footer.component";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [
    SectionComponent,
    StandardFooterComponent,
    StandardHeaderComponent
  ],
  standalone: true
})

export class AboutComponent {
}
