import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appEanValidator]',
  standalone: true
})
export class EanValidatorDirective {
  @Input() maxLength: number = 13;
  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value;
    const isBackspace = event.key === 'Backspace' || event.key === 'Delete';
    const isAllowedKey =
      (event.key >= '0' && event.key <= '9') ||
      event.key === 'Tab' ||
      isBackspace ||
      event.key === 'v' && (event.ctrlKey || event.metaKey) ||
      event.key === 'c' && (event.ctrlKey || event.metaKey);

    if (isAllowedKey) {
      if (!isBackspace && inputValue.length >= this.maxLength) {
        event.preventDefault();
      }
    } else {
      event.preventDefault();
    }
  }

  @HostListener('blur')
  onBlur() {
    const inputValue = this.el.nativeElement.value;
    const sanitizedValue = inputValue.replace(/[^\d]/g, ''); // Remove non-numeric characters

    if (sanitizedValue.length > this.maxLength) {
      // Truncate to the maximum length
      this.el.nativeElement.value = sanitizedValue.substr(0, this.maxLength);
    } else {
      this.el.nativeElement.value = sanitizedValue;
    }
  }
}
