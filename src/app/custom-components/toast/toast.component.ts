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
  ) {}

  toastVCCopy!: ElementRef;
  toastHeight!: number;
  toastWidth!: number;
  count = 0;
  toastParentDomRect!: DOMRect;
  top: string | null = null;
  bottom: string | null = '0px';
  left: string | null = '0px';
  right: string | null = null;
  visibility: string = 'hidden';

  @Input() position: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM' = 'RIGHT';
  @Input() gapInPx: number | undefined;

  @ViewChild('toast') toastVC!: ElementRef;
  @ContentChild('accept') acceptCC: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.toastVCCopy = this.toastVC;

    //get coords of the parent to <app-toast>
    this.toastParentDomRect =
      this.toastVC.nativeElement.parentElement.parentElement.getBoundingClientRect();

    console.log('this.toastParentDomRect');
    console.log(this.toastParentDomRect);

    //add hover event listener
    this.renderer2.listen(
      this.toastVCCopy.nativeElement.parentElement.parentElement,
      'mouseover',
      (e: MouseEvent) => {
        this.visibility = 'visible';
        this.toastHeight = this.toastVC.nativeElement.clientHeight;
        this.toastWidth = this.toastVC.nativeElement.clientWidth;
        this.defineCoords();
      }
    );

    this.renderer2.listen(
      this.toastVCCopy.nativeElement.parentElement.parentElement,
      'mouseout',
      (e: MouseEvent) => {
        this.visibility = 'hidden';
      }
    );

    //improve - use renderer to do this
    this.toastVC.nativeElement.parentElement.remove();
    this.renderer2.appendChild(document.body, this.toastVCCopy.nativeElement);
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

  defineCoords() {
    if (this.gapInPx === undefined || this.gapInPx === null) {
      this.gapInPx = 8;
    }

    switch (this.position) {
      case 'LEFT':
        this.left =
          this.toastParentDomRect.left - this.toastWidth - this.gapInPx + 'px';
        this.top =
          this.toastParentDomRect.top +
          this.toastParentDomRect.height / 2 -
          this.toastHeight / 2 +
          'px';
        break;
      case 'RIGHT': //tested and correct
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
        console.log('top and left');
        console.log(this.top);
        console.log(this.left);

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
