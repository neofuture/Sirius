import {Component, HostBinding} from "@angular/core";
import {SectionComponent} from "../section/section.component";
import {SearchInputComponent} from "../search-input/search-input.component";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  standalone: true,
  imports: [
    SectionComponent,
    SearchInputComponent
  ]
})
export class SearchBarComponent {
  @HostBinding('class.search-bar')
  protected readonly hbClass = true;
}
