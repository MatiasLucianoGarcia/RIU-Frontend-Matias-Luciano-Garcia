import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercaseInput]'
})
export class UppercaseInputDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.toUpperCase();
    input.setSelectionRange(start, end);
  }
}
