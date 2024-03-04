import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDisableLink]',
  exportAs: 'appDisableLink',
})
export class DisableLinkDirective {
  @Input() isDisabled: boolean = false;
  constructor(private element: ElementRef) {}

  @HostListener('click', ['$event']) onClick(e: MouseEvent) {
    if (this.isDisabled) {
      console.log('about to prevent default');
      e.preventDefault();
    }
  }
}
