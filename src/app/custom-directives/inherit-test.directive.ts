import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DefaultClassesDirective } from './default-classes.directive';

@Directive({
  selector: '[appInheritTest]',
})
export class InheritTestDirective extends DefaultClassesDirective {
  private helperTextDefaultVariant = 'text-blue-600';
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    super(
      renderer,
      hostElement,
      new Set(['ml-4', 'mb-2', 'text-xs', 'text-blue-600'])
    );
  }

  @Input() set variant(variant: 'error' | 'success') {
    if (variant !== 'error') {
      this.helperTextValues.delete(this.helperTextDefaultVariant);
    }
    if (variant === 'success') {
      this.helperTextValues.add('text-orange-600');
    }
  }
}
