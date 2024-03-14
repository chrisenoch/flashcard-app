import {
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appDefaultClasses]',
  exportAs: 'appDefaultClasses',
})
export class DefaultClassesDirective implements DoCheck {
  previousCSSClasses: string;
  constructor(public elementCSSClasses: Set<string>) {
    this.previousCSSClasses = this.cssClasses;
  }

  @HostBinding('class') boundClasses: string = this.cssClasses;

  get cssClasses() {
    return Array.from(this.elementCSSClasses.keys()).join(' ');
  }

  //We use doCheck and not ngOnChanges because we care about the changes in the cssClasses, which are not bound to inputs
  //We do not know which input properties child classes will use so we use doCheck.
  ngDoCheck(): void {
    if (this.previousCSSClasses !== this.cssClasses) {
      this.boundClasses = this.cssClasses;
      this.previousCSSClasses = this.cssClasses;
    }
  }

  @Input() set removeClass(cssClass: string) {
    this.elementCSSClasses.delete(cssClass);
  }

  @Input() set removeClasses(cssClasses: string[]) {
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

  @Input() set editClasses(changes: {
    add?: string | string[];
    remove?: string | string[];
  }) {
    const { add, remove } = changes;
    if (add) {
      if (typeof add === 'string') {
        const cssClass = add;
        this.elementCSSClasses.add(cssClass);
      } else {
        const cssClasses = add;
        cssClasses.forEach((cssClass) => {
          this.elementCSSClasses.add(cssClass);
        });
      }
    }
    if (remove) {
      if (typeof remove === 'string') {
        const cssClass = remove;
        this.elementCSSClasses.delete(cssClass);
      } else {
        const cssClasses = remove;
        cssClasses.forEach((cssClass) => {
          this.elementCSSClasses.delete(cssClass);
        });
      }
    }
  }

  removeVariants(variants: { [key: string]: string[] }) {
    const flattenedArr = Object.values(variants).flatMap((ele) => ele);
    this.removeClasses = flattenedArr;
  }
}
