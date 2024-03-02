import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDefaultClasses]',
  exportAs: 'appDefaultClasses',
})
export class DefaultClassesDirective {
  constructor(public elementCSSClasses: Set<string>) {}

  @HostBinding('class') clazz: string = this.cssClasses;

  get cssClasses() {
    return Array.from(this.elementCSSClasses.keys()).join(' ');
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
