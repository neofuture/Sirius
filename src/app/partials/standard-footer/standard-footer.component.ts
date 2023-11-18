import {Component, HostBinding} from "@angular/core";
import {SectionComponent} from "../../components/section/section.component";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-standard-footer',
  standalone: true,
  templateUrl: './standard-footer.component.html',
  imports: [
    SectionComponent
  ],
  styleUrls: ['./standard-footer.component.css']
})

export class StandardFooterComponent {
  @HostBinding('class.footer')
  protected readonly hbClass = true;

  companyName = environment.companyName;
}
