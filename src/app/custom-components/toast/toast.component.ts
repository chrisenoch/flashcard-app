import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, AfterContentInit, AfterViewInit {
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
  display = 'inline-block';

  @Input() animation: boolean | null = null;
  @Input() showArrow = true;
  @Input() arrowLeft: boolean | undefined;
  @Input() arrowRight: boolean | undefined;
  @Input() arrowTop: boolean | undefined;
  @Input() arrowBottom: boolean | undefined;

  @Input() showToast = false;
  @Input() position: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM' = 'RIGHT';
  @Input() gapInPx: number | undefined;

  @ViewChild('toast') toastVC!: ElementRef;
  @ContentChild('accept') acceptCC: ElementRef | undefined;
  @ContentChild('close') closeCC: ElementRef | undefined;

  ngOnInit(): void {
    this.defineArrow();
  }

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
      // if (this.showToast) {
      //   //this.visibility = 'visible';
      //   this.display = 'inline-block';
      // }
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

      if (this.closeCC) {
        this.renderer2.listen(
          this.closeCC.nativeElement,
          'click',
          (e: MouseEvent) => {
            this.display = 'none';
            this.showToast = false;
            //this.visibility = 'hidden';
          }
        );
      }
    }
  }

  private addHoverEventListeners() {
    this.renderer2.listen(
      this.toastVCCopy.nativeElement.parentElement.parentElement,
      'mouseover',
      (e: MouseEvent) => {
        //this.visibility = 'visible';
        this.display = 'inline-block';
        console.log('in hover');
      }
    );

    this.renderer2.listen(
      this.toastVCCopy.nativeElement.parentElement.parentElement,
      'mouseout',
      (e: MouseEvent) => {
        if (!this.showToast) {
          //this.visibility = 'hidden';
          console.log('inside mouseout');
          this.display = 'none';
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

    //set display to none ASAP to avoid possible jumps in the UI. None found, this is a precaution.
    if (this.showToast) {
      //this.visibility = 'visible';
      this.display = 'inline-block';
    } else {
      this.display = 'none';
    }
    this.visibility = 'visible';

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

  private defineArrow() {
    if (
      this.arrowTop === undefined &&
      this.arrowBottom === undefined &&
      this.arrowLeft === undefined &&
      this.arrowRight === undefined
    ) {
      switch (this.position) {
        case 'LEFT':
          this.arrowRight = true;
          break;
        case 'RIGHT':
          this.arrowLeft = true;
          break;

        case 'TOP':
          this.arrowBottom = true;
          break;
        case 'BOTTOM':
          this.arrowTop = true;
          break;
        default:
          const exhaustiveCheck: never = this.position;
          throw new Error(exhaustiveCheck);
      }
    }
  }

  accept() {
    console.log('inside accept in toast');
  }

  deny() {
    console.log('inside deny in toast');
  }
}
