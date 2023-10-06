import {Component, HostBinding} from "@angular/core";
import {SectionComponent} from "../section/section.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css'],
  imports: [
    SectionComponent,
    RouterLink
  ],
  standalone: true
})

export class HeaderBarComponent {
  @HostBinding('class.header__bar')
  protected readonly hbClass = true;
}
