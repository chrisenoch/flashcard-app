import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDefaultClasses]',
  exportAs: 'appDefaultClasses',
})
export class DefaultClassesDirective implements OnInit {
  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef,
    public elementCSSClasses: Set<string>
  ) {}
  ngOnInit(): void {
    Array.from(this.elementCSSClasses.keys()).forEach((cssClass) => {
      this.renderer.addClass(this.hostElement.nativeElement, cssClass);
    });
  }

  @Input() set deleteClass(cssClass: string) {
    this.elementCSSClasses.delete(cssClass);
  }

  @Input() set deleteClasses(cssClasses: string[]) {
    cssClasses.forEach((cssClass) => {
      this.elementCSSClasses.delete(cssClass);
    });
  }

  @Input() set addClass(cssClass: string) {
    this.elementCSSClasses.add(cssClass);
  }

  @Input() set addClasses(cssClasses: string[]) {
    cssClasses.forEach((cssClass) => {
      this.elementCSSClasses.add(cssClass);
    });
  }

  get cssClasses() {
    return Array.from(this.elementCSSClasses.keys()).join(' ');
  }
}
