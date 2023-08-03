import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  NgZone,
} from '@angular/core';
import {
  Observable,
  Subscription,
  fromEvent,
  pipe,
  timer,
  interval,
  debounce,
  debounceTime,
  tap,
  map,
  filter,
  takeUntil,
  takeWhile,
  finalize,
} from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent
  implements OnInit, DoCheck, AfterContentInit, AfterViewInit, OnDestroy
{
  constructor(
    @Inject(DOCUMENT) document: Document,
    private renderer2: Renderer2,
    private ngZone: NgZone
  ) {
    this.documentInjected = document;
  }
  ngDoCheck(): void {
    //console.log('DoCheck ran');
  }

  resizeObs$!: Observable<Event>;
  resizeSub$!: Subscription;
  documentInjected!: Document;
  toastHeight!: number;
  toastWidth!: number;
  count = 0;
  isResizing = false;
  toastParentDomRect!: DOMRect;
  originalToastParent!: Element;
  top: string | null = '0px';
  bottom: string | null = null;
  left: string | null = '0px';
  right: string | null = null;
  visibility = 'hidden';
  display = 'inline-block';
  showOnInitDelayTimer: any | undefined;
  hideOnInitDelayTimer: any | undefined;
  hideDelayTimer: any | undefined;
  showDelayTimer: any | undefined;

  @Input() animation: boolean | null = null;
  //Used to programmatically determine if the toast is showing or not.

  @Input() show = false;
  @Input() hideDelay = 0;
  @Input() showDelay = 0;
  @Input() showOnInitDelay = 0;
  @Input() hideOnInitDelay = 0;
  @Input() showArrow = true;
  @Input() arrowLeft: boolean | undefined;
  @Input() arrowRight: boolean | undefined;
  @Input() arrowTop: boolean | undefined;
  @Input() arrowBottom: boolean | undefined;
  @Input() position: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM' = 'RIGHT';
  @Input() gapInPx: number | undefined;

  //E.g. for a timer of 5 seconds, you would use intervalPeriod with a value of 1000 and repetitions with a value of 5.
  timer(intervalPeriod: number, repetitions: number) {
    //object needed so can change values with this return object from outside this function via a closure.
    let controlObj: {
      sub: null | Observable<number>;
      isActive: boolean;
      count: number;
      pauseTimer: boolean;
      cancelTimer: boolean;
    } = {
      sub: null,
      isActive: false,
      count: 0,
      pauseTimer: false,
      cancelTimer: false,
    };

    controlObj.sub = interval(intervalPeriod).pipe(
      tap(() => {
        if (controlObj.count === 0) {
          controlObj.isActive = true;
        }
      }),
      // map(() => 0),
      map(() => {
        if (controlObj.cancelTimer) {
          return repetitions;
        } else if (controlObj.pauseTimer) {
          return controlObj.count;
        } else {
          return ++controlObj.count;
        }
      }),

      takeWhile((val) => val < repetitions),
      finalize(() => {
        controlObj.isActive = false;
        controlObj.count = 0;
        controlObj.pauseTimer = false;
        controlObj.cancelTimer = false;
      })
    );
    return controlObj;
  }

  @ViewChild('toast') toastVC!: ElementRef;
  @ContentChild('show', { descendants: true }) showCC: ElementRef | undefined;
  @ContentChild('close') closeCC: ElementRef | undefined;

  ngOnInit(): void {
    this.defineArrow();
    this.checkInputs();

    if (this.showOnInitDelay > 0 || this.hideOnInitDelay > 0) {
      this.show = true;
    }

    this.resizeObs$ = fromEvent(window, 'resize');
    this.ngZone.runOutsideAngular(() => {
      let displayChanged = false;
      let firstOfResizeBatch = true;

      this.resizeSub$ = this.resizeObs$
        .pipe(
          tap(() => {
            this.isResizing = true;
            if (firstOfResizeBatch) {
              this.ngZone.run(() => {
                this.visibility = 'hidden';
                firstOfResizeBatch = false;
                if (this.display === 'none') {
                  this.display = 'inline-block';
                  displayChanged = true;
                }
              });
            }
          }),
          debounceTime(1000)
        )
        .subscribe((e) => {
          this.ngZone.run(() => {
            this.toastParentDomRect =
              this.originalToastParent.getBoundingClientRect();
            this.defineCoords();

            if (displayChanged) {
              this.display = 'none';
              displayChanged = false;
            }
            this.visibility = 'visible';
            this.isResizing = false;
            firstOfResizeBatch = true;
          });
        });
    });
  }

  ngAfterViewInit(): void {
    this.originalToastParent =
      this.toastVC.nativeElement.parentElement.parentElement;
    //get coords of the parent to <app-toast>. Toast should show upon hovering this.
    this.toastParentDomRect = this.originalToastParent.getBoundingClientRect();

    console.log(this.toastParentDomRect);

    this.addHoverEventListeners();

    this.moveToastToBody();

    //setTimeout to avoid error: "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked"
    //300ms delay necessary because Angular renders incorrect offsetHeight if not. The same problem occurs in AfterViewChecked. Thus delay implemented as per lack of other ideas and this stackoverflow answer. https://stackoverflow.com/questions/46637415/angular-4-viewchild-nativeelement-offsetwidth-changing-unexpectedly "This is a common painpoint .."
    this.showOnInitDelayTimer = setTimeout(() => {
      this.defineCoords();

      if (this.hideOnInitDelay > 0) {
        this.hideOnInitDelayTimer = setTimeout(() => {
          this.updateShow(false);
        }, this.hideOnInitDelay);
      }
    }, 300 + Math.abs(this.showOnInitDelay));
  }

  ngAfterContentInit(): void {
    if (this.showCC) {
      console.log('showCC is defined');
      this.renderer2.listen(
        this.showCC.nativeElement,
        'click',
        (e: MouseEvent) => {
          console.log(
            'dynamically inserted show button was clicked. Now setting top and left'
          );
        }
      );
    }
    if (this.closeCC) {
      console.log('closeCC is defined');
      this.renderer2.listen(
        this.closeCC.nativeElement,
        'click',
        (e: MouseEvent) => {
          this.updateShow(false);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.resizeSub$.unsubscribe();
  }

  //Show should not have a setter. Upon initialisation and window resize display must not be set to none even if show is set to false. Visibility:hidden is needed in order to calculate the coordinates of the toast in defineCoords()
  private updateShow(isShow: boolean) {
    if (isShow) {
      this.display = 'inline-block';
    } else {
      this.display = 'none';
      this.show = false;
    }
  }

  private addHoverEventListeners() {
    this.renderer2.listen(
      this.toastVC.nativeElement.parentElement.parentElement,
      'mouseover',
      (e: MouseEvent) => {
        clearTimeout(this.hideDelayTimer);
        clearTimeout(this.showOnInitDelayTimer);
        clearTimeout(this.hideOnInitDelayTimer);

        if (this.showDelay > 0) {
          this.showDelayTimer = setTimeout(
            () => this.updateShow(true),
            this.showDelay
          );
        } else {
          this.updateShow(true);
        }
      }
    );

    this.renderer2.listen(
      this.toastVC.nativeElement.parentElement.parentElement,
      'mouseout',
      (e: MouseEvent) => {
        clearTimeout(this.showDelayTimer);

        if (this.hideDelay > 0) {
          this.hideDelayTimer = setTimeout(
            () => this.updateShow(false),
            this.hideDelay
          );
        } else {
          if (!this.show) {
            this.updateShow(false);
          }
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
      this.toastVC.nativeElement
    );
  }

  private defineCoords() {
    if (this.gapInPx === undefined || this.gapInPx === null) {
      this.gapInPx = 8;
    }

    this.toastHeight = this.toastVC.nativeElement.offsetHeight;
    this.toastWidth = this.toastVC.nativeElement.offsetWidth;

    if (!this.isResizing) {
      //set display to none ASAP to avoid possible jumps in the UI. None found, this is a precaution.
      if (this.show) {
        this.display = 'inline-block';
      } else {
        this.display = 'none';
      }
      this.visibility = 'visible';
    }

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

    console.log('top + bottom + left + right');
    console.log(
      this.top + ' ' + this.bottom + ' ' + this.left + ' ' + this.right
    );
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

  private checkInputs() {
    if (this.hideDelay < 0) {
      throw Error('hideDelay must not be less than 0.');
    }
    if (this.showDelay < 0) {
      throw Error('showDelay must not be less than 0.');
    }
    if (this.hideOnInitDelay < 0) {
      throw Error('hideOnInitDelay must not be less than 0.');
    }
    if (this.showOnInitDelay < 0) {
      throw Error('showOnInitDelay must not be less than 0.');
    }
  }

  accept() {
    console.log('inside accept in toast');
  }

  deny() {
    console.log('inside deny in toast');
  }
}
