import {Component, HostBinding, Input} from "@angular/core";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
  standalone: true
})

export class SectionComponent {
  @HostBinding('class.section__container')
  protected readonly hbClass = true;

  @HostBinding('class.section__container--column')
  get hbClassColumn(): boolean {
    return this.flexDirection === 'column';
  }

  @HostBinding('class.section__container--row')
  get hbClassRow(): boolean {
    return this.flexDirection === 'row';
  }

  @HostBinding('class.section__container--start')
  get hbClassFlexStart(): boolean {
    return this.justifyContent === 'start';
  }

  @HostBinding('class.section__container--end')
  get hbClassFlexEnd(): boolean {
    return this.justifyContent === 'end';
  }

  @HostBinding('class.section__container--center')
  get hbClassCenter(): boolean {
    return this.justifyContent === 'center';
  }

  @HostBinding('class.section__container--space-between')
  get hbClassSpaceBetween(): boolean {
    return this.justifyContent === 'space-between';
  }

  @HostBinding('class.section__container--space-around')
  get hbClassSpaceAround(): boolean {
    return this.justifyContent === 'space-around';
  }

  @Input() flexDirection: 'row' | 'column' = 'row';
  @Input() justifyContent: 'start' | 'end' | 'center' | 'space-between' | 'space-around' = 'start';
}
