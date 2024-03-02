import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DefaultClassesDirective } from './default-classes.directive';

@Directive({
  selector: '[appInputClasses]',
  exportAs: 'appInputClasses',
})
export class InputClassesDirective extends DefaultClassesDirective {
  defaultVariantProps: string[];
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    //I can't define these classes in the class member defaultVariantProps because I can't use this before super.
    const defaultVariantProps = [
      'border-purple-500',
      'focus:shadow-[0_0_0_0.125em]',
      'focus:shadow-purple-500/50',
    ];
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
        ...defaultVariantProps,
      ])
    );

    this.defaultVariantProps = defaultVariantProps;
  }

  getVariants() {
    const variants = {
      secondary: this.defaultVariantProps,
      error: [
        'border-red-500',
        'focus:shadow-[0_0_0_0.125em]',
        'focus:shadow-red-500/50',
      ],
    };
    return variants;
  }

  //To do: should have default variant
  @Input() set variant(variant: 'secondary' | 'error') {
    this.removeVariants(this.getVariants());
    this.addClasses = this.getVariants()[variant];
  }
}
