import {Component} from "@angular/core";
import {HeaderBarComponent} from "../../components/header-bar/header-bar.component";
import {NavigationComponent} from "../../components/navigation/navigation.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {SectionComponent} from "../../components/section/section.component";

@Component({
  selector: 'app-standard-header',
  templateUrl: './standard-header.component.html',
  standalone: true,
  imports: [
    HeaderBarComponent,
    NavigationComponent,
    SearchBarComponent,
    SectionComponent
  ]
})

export class StandardHeaderComponent {

  }
