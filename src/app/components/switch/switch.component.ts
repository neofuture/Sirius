import {Component, Input} from "@angular/core";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {noop} from "rxjs";

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  standalone: true,
  imports: [
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SwitchComponent,
      multi: true
    }
  ]
})

export class SwitchComponent implements ControlValueAccessor{
  @Input() checked: boolean = false;
  protected onChange: (value: boolean) => void = () => noop;
  protected onTouched: () => void = () => noop;
  value: boolean = false;

  constructor() {
  }

  change(checked: any) {
    this.writeValue(checked.target.checked)
    this.onChange(checked.target.checked);
    this.onTouched();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: ()=>void): void {
    this.onTouched = fn
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
}
