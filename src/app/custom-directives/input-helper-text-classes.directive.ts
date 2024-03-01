import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { DefaultClassesDirective } from './default-classes.directive';

@Directive({
  selector: '[appInputHelperTextClasses]',
  exportAs: 'appInputHelperTextClasses',
})
export class InputHelperTextClassesDirective extends DefaultClassesDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    super(renderer, hostElement, new Set(['ml-4', 'mb-2', 'text-xs']));
  }

  @Input() set variant(variant: 'error' | 'success') {
    this.deleteClasses = ['text-red-600', 'text-green-600'];
    if (variant === 'error') {
      this.elementCSSClasses.add('text-red-600');
    }

    if (variant === 'success') {
      this.elementCSSClasses.add('text-green-600');
    }

    console.log('new element css classes');
    console.log(this.elementCSSClasses);
  }
}
