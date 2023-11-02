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
    const regex = new RegExp(`^[0-9]*\.?[0-9]{0,${this.decimalPlaces}}$`);
    if (!regex.test(value)) {
      const previousValue = this.el.nativeElement.value;
      const newValue = previousValue.match(new RegExp(`[0-9]*\.?[0-9]{0,${this.decimalPlaces}}`));
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
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      isBackspace ||
      event.key === 'v' && (event.ctrlKey || event.metaKey) ||
      event.key === 'c' && (event.ctrlKey || event.metaKey);

    if (!isAllowedKey) {
      event.preventDefault();
    }
  }

  @HostListener('blur')
  onBlur() {
    let inputValue = this.el.nativeElement.value;
    inputValue = inputValue.replace(/[^\d.]/g, '');
    const parts = inputValue.split('.');

    if (parts.length === 1) {
      inputValue = inputValue + ".00";
    } else if (parts.length === 2) {
      if (parts[1].length === 1) {
        inputValue = inputValue + "0";
      }
    }

    this.el.nativeElement.value = inputValue;
  }
}
