import { DOCUMENT } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent
  implements AfterContentInit, AfterViewInit, AfterViewChecked
{
  constructor(
    @Inject(DOCUMENT) document: Document,
    private renderer2: Renderer2
  ) {}

  @Input() position: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM' = 'RIGHT';
  @Input() gapInPx: number | undefined;

  @ViewChild('toast') toastViewChild!: ElementRef;
  @ContentChild('accept') acceptContentChild: ElementRef | undefined;

  toastViewChildCopy!: ElementRef;
  toastHeight!: number;
  toastWidth!: number;
  count = 0;
  toastParentDomRect!: DOMRect;
  top: number | null = null;
  bottom: number | null = null;
  left: number | null = null;
  right: number | null = null;

  ngAfterViewInit(): void {
    this.toastHeight = this.toastViewChild.nativeElement.height;
    this.toastWidth = this.toastViewChild.nativeElement.width;
    this.defineCoords();

    this.toastViewChildCopy = this.toastViewChild;
    this.toastViewChild.nativeElement.parentElement.remove();
    this.renderer2.appendChild(
      document.body,
      this.toastViewChildCopy.nativeElement
    );
  }

  ngAfterViewChecked(): void {
    //
  }

  ngAfterContentInit(): void {
    if (this.acceptContentChild) {
      this.renderer2.listen(
        this.acceptContentChild.nativeElement,
        'click',
        (e: MouseEvent) => {
          console.log('dynamically inserted accept button was clicked');
        }
      );
    }
  }

  defineCoords() {
    this.toastParentDomRect =
      this.toastViewChild.nativeElement.parentElement.parentElement.getBoundingClientRect();

    if (this.gapInPx === undefined || this.gapInPx === null) {
      this.gapInPx = 8;
    }

    switch (this.position) {
      case 'LEFT':
        this.left =
          this.toastParentDomRect.left - this.toastWidth - this.gapInPx;
        this.top = this.toastParentDomRect.height / 2 - this.toastHeight / 2;
        break;
      case 'RIGHT':
        this.left =
          this.toastParentDomRect.left +
          this.toastParentDomRect.width +
          this.gapInPx;
        this.top = this.toastParentDomRect.height / 2 - this.toastHeight / 2;
        break;
      case 'TOP':
        this.left = this.toastParentDomRect.width / 2 + this.toastWidth / 2;
        this.top = this.toastHeight - this.gapInPx;
        break;
      case 'BOTTOM':
        this.left = this.toastParentDomRect.width / 2 + this.toastWidth / 2;
        this.top =
          this.toastParentDomRect.top +
          this.toastParentDomRect.height +
          this.gapInPx;
        break;
      default:
        const exhaustiveCheck: never = this.position;
        throw new Error(exhaustiveCheck);
    }
  }

  accept() {
    console.log('inside accept in toast');
  }

  deny() {
    console.log('inside deny in toast');
  }
}
