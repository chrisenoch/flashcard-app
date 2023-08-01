import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements AfterContentInit, AfterViewInit {
  constructor(
    @Inject(DOCUMENT) document: Document,
    private renderer2: Renderer2
  ) {
    this.documentInjected = document;
  }
  documentInjected!: Document;
  toastVCCopy!: ElementRef;
  toastHeight!: number;
  toastWidth!: number;
  count = 0;
  toastParentDomRect!: DOMRect;
  top: string | null = null;
  bottom: string | null = '0px';
  left: string | null = '0px';
  right: string | null = null;
  visibility = 'hidden';

  @Input() animation: boolean | null = null;
  @Input() showArrow = true;
  @Input() arrowLeft = false;
  @Input() arrowRight = true;
  @Input() arrowTop = false;
  @Input() arrowBottom = false;

  @Input() showToast = false;
  @Input() position: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM' = 'RIGHT';
  @Input() gapInPx: number | undefined;

  @ViewChild('toast') toastVC!: ElementRef;
  @ContentChild('accept') acceptCC: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.toastVCCopy = this.toastVC;

    //get coords of the parent to <app-toast>. Toast should show upon hovering this.
    this.toastParentDomRect =
      this.toastVC.nativeElement.parentElement.parentElement.getBoundingClientRect();

    console.log(this.toastParentDomRect);

    this.addHoverEventListeners();

    this.moveToastToBody();

    //setTimeout to avoid error: "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked"
    //delay necessary because Angular renders incorrect offsetHeight if not. The same problem occurs in AfterViewChecked. Thus delay implemented as per lack of other ideas and this stackoverflow answer. https://stackoverflow.com/questions/46637415/angular-4-viewchild-nativeelement-offsetwidth-changing-unexpectedly "This is a common painpoint .."
    setTimeout(() => {
      this.defineCoords();
      if (this.showToast) {
        this.visibility = 'visible';
      }
    }, 300);
  }

  ngAfterContentInit(): void {
    if (this.acceptCC) {
      this.renderer2.listen(
        this.acceptCC.nativeElement,
        'click',
        (e: MouseEvent) => {
          console.log('dynamically inserted accept button was clicked');
        }
      );
    }
  }

  private addHoverEventListeners() {
    this.renderer2.listen(
      this.toastVCCopy.nativeElement.parentElement.parentElement,
      'mouseover',
      (e: MouseEvent) => {
        this.visibility = 'visible';
      }
    );

    this.renderer2.listen(
      this.toastVCCopy.nativeElement.parentElement.parentElement,
      'mouseout',
      (e: MouseEvent) => {
        if (!this.showToast) {
          this.visibility = 'hidden';
        }
      }
    );
  }

  private moveToastToBody() {
    //alternative: this.toastVC.nativeElement.parentElement.remove();
    this.renderer2.removeChild(
      this.toastVC.nativeElement.parentElement,
      this.toastVC.nativeElement
    );

    this.renderer2.appendChild(
      this.documentInjected.body,
      this.toastVCCopy.nativeElement
    );
  }

  private defineCoords() {
    if (this.gapInPx === undefined || this.gapInPx === null) {
      this.gapInPx = 8;
    }

    this.toastHeight = this.toastVCCopy.nativeElement.offsetHeight;
    this.toastWidth = this.toastVCCopy.nativeElement.offsetWidth;
    console.log('toastHeight - this.toastWidth - this.gapInPx ');
    console.log(this.toastHeight + ' ' + this.toastWidth + ' ' + this.gapInPx);

    switch (this.position) {
      case 'LEFT':
        this.left =
          this.toastParentDomRect.left - this.toastWidth - this.gapInPx + 'px';
        console.log('left in switch ' + this.left);

        this.top =
          this.toastParentDomRect.top +
          this.toastParentDomRect.height / 2 -
          this.toastHeight / 2 +
          'px';
        break;
      case 'RIGHT':
        this.left =
          this.toastParentDomRect.left +
          this.toastParentDomRect.width +
          this.gapInPx +
          'px';
        this.top =
          this.toastParentDomRect.top +
          this.toastParentDomRect.height / 2 -
          this.toastHeight / 2 +
          'px';

        break;
      case 'TOP':
        this.left =
          this.toastParentDomRect.left -
          this.toastWidth / 2 +
          this.toastParentDomRect.width / 2 +
          'px';
        this.top =
          this.toastParentDomRect.top - this.toastHeight - this.gapInPx + 'px';
        break;
      case 'BOTTOM':
        this.left =
          this.toastParentDomRect.left -
          this.toastWidth / 2 +
          this.toastParentDomRect.width / 2 +
          'px';
        this.top =
          this.toastParentDomRect.top +
          this.toastParentDomRect.height +
          this.gapInPx +
          'px';
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
