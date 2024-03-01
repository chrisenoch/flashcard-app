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

  variants = {
    success: 'text-green-600',
    error: 'text-red-600',
  };

  @Input() set variant(variant: 'error' | 'success') {
    this.deleteClasses = [...Object.values(this.variants)];
    if (variant === 'error') {
      this.elementCSSClasses.add(this.variants.error);
    }

    if (variant === 'success') {
      this.elementCSSClasses.add(this.variants.success);
    }
  }
}
