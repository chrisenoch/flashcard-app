import { AfterViewChecked, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appFocusForm]',
})
export class FocusFormDirective {
  constructor(private el: ElementRef) {}
  @Input() set shouldFocus(focuser: { shouldFocus: boolean }) {
    if (focuser.shouldFocus) {
      this.el.nativeElement.focus();
    }
  }
}
