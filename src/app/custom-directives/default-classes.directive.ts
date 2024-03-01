import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appDefaultClasses]',
  exportAs: 'appDefaultClasses',
})
export class DefaultClassesDirective implements OnInit, OnChanges {
  constructor(
    public renderer: Renderer2,
    public hostElement: ElementRef,
    public elementCSSClasses: Set<string>,
    public ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Array.from(this.elementCSSClasses.keys()).forEach((cssClass) => {
    //   this.renderer.addClass(this.hostElement.nativeElement, cssClass);
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('inside o changes');
    Array.from(this.elementCSSClasses.keys()).forEach((cssClass) => {
      console.log('adding class: ' + cssClass);
      this.renderer.addClass(this.hostElement.nativeElement, cssClass);
    });
    this.ref.detectChanges();
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
