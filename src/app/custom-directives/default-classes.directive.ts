import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDefaultClasses]',
  exportAs: 'appDefaultClasses',
})
export class DefaultClassesDirective implements OnInit {
  @Input() errorTextValues = new Set([
    'ml-4',
    'mb-2',
    'text-xs',
    'text-red-600',
  ]);
  get errorText() {
    return Array.from(this.errorTextValues.keys()).join(' ');
  }

  @Input() set deleteClass(cssClass: string) {
    this.errorTextValues.delete(cssClass);
  }

  constructor(private renderer: Renderer2, private hostElement: ElementRef) {}
  ngOnInit(): void {
    Array.from(this.errorTextValues.keys()).forEach((cssClass) => {
      this.renderer.addClass(this.hostElement.nativeElement, cssClass);
    });
  }
}
