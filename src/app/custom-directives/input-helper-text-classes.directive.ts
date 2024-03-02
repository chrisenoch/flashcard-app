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
  constructor() {
    super(new Set(['ml-4', 'mb-2', 'text-xs']));
  }

  private getVariants() {
    const variants = {
      success: ['text-green-600'],
      error: ['text-red-600'],
    };
    return variants;
  }

  @Input() set variant(variant: 'error' | 'success') {
    this.removeVariants(this.getVariants());
    this.addClasses = this.getVariants()[variant];
  }
}
