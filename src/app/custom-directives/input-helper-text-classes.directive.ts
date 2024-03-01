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
})
export class InputHelperTextClassesDirective
  extends DefaultClassesDirective
  implements OnChanges
{
  private helperTextDefaultVariant: string;
  constructor(
    renderer: Renderer2,
    hostElement: ElementRef,
    ref: ChangeDetectorRef
  ) {
    const helperTextDefaultVariant = 'text-red-600';
    super(
      renderer,
      hostElement,
      new Set(['ml-4', 'mb-2', 'text-xs', helperTextDefaultVariant]),
      ref
    );
    this.helperTextDefaultVariant = helperTextDefaultVariant;
  }

  @Input() set variant(variant: 'error' | 'success') {
    console.log('in input setter');
    if (variant !== 'error') {
      this.elementCSSClasses.delete(this.helperTextDefaultVariant);
    }
    if (variant === 'success') {
      this.elementCSSClasses.add('text-green-600');
    }

    console.log('new element css classes');
    console.log(this.elementCSSClasses);

    this.ref.detectChanges();
  }
}
