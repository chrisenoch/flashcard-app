import { Directive, DoCheck, Input } from '@angular/core';
import { DefaultClassesDirective } from './default-classes.directive';

@Directive({
  selector: '[appInputHelperTextClasses]',
  exportAs: 'appInputHelperTextClasses',
})
export class InputHelperTextClassesDirective
  extends DefaultClassesDirective
  implements DoCheck
{
  constructor() {
    super(new Set(['ml-4', 'mb-2', 'text-xs']));
  }

  @Input() set variant(variant: 'error' | 'success') {
    console.log('in input setter');
    this.removeVariants(this.getVariants());
    this.addClasses = this.getVariants()[variant];
  }

  private getVariants() {
    const variants = {
      success: ['text-green-600'],
      error: ['text-red-600'],
    };
    return variants;
  }
}
