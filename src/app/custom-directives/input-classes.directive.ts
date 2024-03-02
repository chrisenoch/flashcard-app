import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DefaultClassesDirective } from './default-classes.directive';

@Directive({
  selector: '[appInputClasses]',
  exportAs: 'appInputClasses',
})
export class InputClassesDirective extends DefaultClassesDirective {
  defaultVariantProps: string[];
  constructor() {
    //I can't define these classes in the class member defaultVariantProps because I can't use this.defaultVariantProps before super.
    const defaultVariantProps = [
      'border-purple-500',
      'focus:shadow-[0_0_0_0.125em]',
      'focus:shadow-purple-500/50',
    ];
    super(
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
        ...defaultVariantProps,
      ])
    );

    this.defaultVariantProps = defaultVariantProps;
  }

  private getVariants() {
    const variants = {
      primary: this.defaultVariantProps,
      secondary: [
        'border-pink-500',
        'focus:shadow-[0_0_0_0.125em]',
        'focus:shadow-pink-500/50',
      ],

      error: [
        'border-red-500',
        'focus:shadow-[0_0_0_0.125em]',
        'focus:shadow-red-500/50',
      ],
    };
    return variants;
  }

  @Input() set variant(variant: 'primary' | 'secondary' | 'error') {
    this.removeVariants(this.getVariants());
    this.addClasses = this.getVariants()[variant];
  }
}
