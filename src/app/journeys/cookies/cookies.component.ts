import {Component} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {StandardFooterComponent} from "../../partials/standard-footer/standard-footer.component";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css'],
  imports: [
    SectionComponent,
    StandardFooterComponent,
    StandardHeaderComponent
  ],
  standalone: true
})

export class CookiesComponent {
}
