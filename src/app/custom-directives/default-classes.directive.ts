import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDefaultClasses]',
  exportAs: 'appDefaultClasses',
})
export class DefaultClassesDirective implements OnInit {
  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef,
    public helperTextValues: Set<string>
  ) {}
  ngOnInit(): void {
    Array.from(this.helperTextValues.keys()).forEach((cssClass) => {
      this.renderer.addClass(this.hostElement.nativeElement, cssClass);
    });
  }

  //private helperTextDefaultVariant = 'text-red-600';

  // @Input() helperTextValues = new Set([
  //   'ml-4',
  //   'mb-2',
  //   'text-xs',
  //   this.helperTextDefaultVariant,
  // ]);

  // @Input() set variant(variant: 'error' | 'success') {
  //   if (variant !== 'error') {
  //     this.helperTextValues.delete(this.helperTextDefaultVariant);
  //   }
  //   if (variant === 'success') {
  //     this.helperTextValues.add('text-green-600');
  //   }
  // }

  @Input() set deleteClass(cssClass: string) {
    this.helperTextValues.delete(cssClass);
  }

  @Input() set deleteClasses(cssClasses: string[]) {
    cssClasses.forEach((cssClass) => {
      this.helperTextValues.delete(cssClass);
    });
  }

  @Input() set addClass(cssClass: string) {
    this.helperTextValues.add(cssClass);
  }

  @Input() set addClasses(cssClasses: string[]) {
    cssClasses.forEach((cssClass) => {
      this.helperTextValues.add(cssClass);
    });
  }

  get helperText() {
    return Array.from(this.helperTextValues.keys()).join(' ');
  }
}
