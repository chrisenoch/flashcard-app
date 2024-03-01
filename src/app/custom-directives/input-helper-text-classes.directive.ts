import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DefaultClassesDirective } from './default-classes.directive';

@Directive({
  selector: '[appInputHelperTextClasses]',
})
export class InputHelperTextClassesDirective extends DefaultClassesDirective {
  private helperTextDefaultVariant: string;
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    const helperTextDefaultVariant = 'text-red-600';
    super(
      renderer,
      hostElement,
      new Set(['ml-4', 'mb-2', 'text-xs', helperTextDefaultVariant])
    );
    this.helperTextDefaultVariant = helperTextDefaultVariant;
  }

  @Input() set variant(variant: 'error' | 'success') {
    if (variant !== 'error') {
      this.elementCSSClasses.delete(this.helperTextDefaultVariant);
    }
    if (variant === 'success') {
      this.elementCSSClasses.add('text-green-600');
    }
  }
}
