import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { DefaultClassesDirective } from './default-classes.directive';
import { initFields } from '../models/types/getFields';

@Directive({
  selector: '[appInputHelperTextClasses]',
  exportAs: 'appInputHelperTextClasses',
})
export class InputHelperTextClassesDirective
  extends DefaultClassesDirective
  implements DoCheck
{
  cssClassesPrevious: string;
  constructor() {
    super(new Set(['ml-4', 'mb-2', 'text-xs']));
    this.cssClassesPrevious = this.cssClasses;
  }
  // @HostBinding('class') clazz: string = this.cssClasses;

  ngDoCheck(): void {
    console.log('in directive docheck');
    if (this.cssClassesPrevious !== this.cssClasses) {
      this.clazz = this.cssClasses;
      this.cssClassesPrevious = this.cssClasses;
    }
  }

  private getVariants() {
    const variants = {
      success: ['text-green-600'],
      error: ['text-red-600'],
    };
    return variants;
  }

  @Input() set variant(variant: 'error' | 'success') {
    console.log('in input setter');
    this.removeVariants(this.getVariants());
    this.addClasses = this.getVariants()[variant];
    //this.clazz = this.cssClasses;
  }
}
