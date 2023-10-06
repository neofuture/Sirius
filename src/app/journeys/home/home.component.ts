import {Component} from "@angular/core";
import {StandardHeaderComponent} from "../../partials/standard-header/standard-header.component";
import {SectionComponent} from "../../components/section/section.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    StandardHeaderComponent,
    SectionComponent
  ],
  standalone: true
})

export class HomeComponent {

}
