import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { DefaultClassesDirective } from './default-classes.directive';

@Directive({
  selector: '[appInputClasses]',
  exportAs: 'appInputClasses',
})
export class InputClassesDirective extends DefaultClassesDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    super(
      renderer,
      hostElement,
      new Set([
        'mb-2',
        'outline-none',
        'border',
        'rounded-md',
        'w-full',
        'items-center',
        'inline-flex',
        'h-12',
        'justify-start',
        'leading-6',
        'p-4',
        'border-purple-500',
        'focus:shadow-[0_0_0_0.125em]',
        'focus:shadow-purple-500/50',
      ])
    );
  }
}
