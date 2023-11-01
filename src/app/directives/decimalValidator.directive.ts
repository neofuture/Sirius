import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appDecimalValidator]',
  standalone: true
})
export class DecimalValidatorDirective {
  @Input() decimalPlaces: number | undefined;

  constructor(private el: ElementRef) {
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const regex = new RegExp(`^[0-9]+(\.[0-9]{1,${this.decimalPlaces}})?$`);
    if (!regex.test(value)) {
      const previousValue = this.el.nativeElement.value;
      const newValue = previousValue.match(new RegExp(`[0-9]+(\.[0-9]{1,${this.decimalPlaces}})?`));
      if (newValue) {
        this.el.nativeElement.value = newValue[0];
      } else {
        this.el.nativeElement.value = '';
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const isBackspace = event.key === 'Backspace' || event.key === 'Delete';
    const isAllowedKey =
      (event.key >= '0' && event.key <= '9') ||
      event.key === '.' ||
      event.key === 'Tab' ||
      isBackspace ||
      event.key === 'v' && (event.ctrlKey || event.metaKey) ||
      event.key === 'c' && (event.ctrlKey || event.metaKey);

    if (isAllowedKey) {
      return;
    } else {
      event.preventDefault();
    }
  }

  @HostListener('blur')
  onBlur() {
    const inputValue = this.el.nativeElement.value;
    this.el.nativeElement.value = inputValue.replace(/[^\d.]/g, '');
  }
}
