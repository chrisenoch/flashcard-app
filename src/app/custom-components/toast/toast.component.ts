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
  HostListener,
  AfterViewChecked,
  AfterContentChecked,
} from '@angular/core';
import {
  Observable,
  Subscription,
  fromEvent,
  pipe,
  interval,
  debounce,
  debounceTime,
  tap,
  map,
  filter,
  takeUntil,
  takeWhile,
  finalize,
  Subject,
  take,
} from 'rxjs';
import { controlledTimer } from 'src/app/models/interfaces/controlledTimer';
import { ToastService } from './toast.service';
import { Position } from './models/position';
import { ArrowPosition, Arrows } from './models/arrows';
import { ControlledError } from '../errors/ControlledError';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent
  implements
    OnInit,
    AfterContentInit,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  constructor(
    @Inject(DOCUMENT) document: Document,
    private renderer2: Renderer2,
    private ngZone: NgZone,
    private toastService: ToastService
  ) {
    this.documentInjected = document;
  }

  toastTop: string | null = '0px';
  toastBottom: string | null = null;
  toastLeft: string | null = '0px';
  toastRight: string | null = null;
  toastAnchorTop: string | null = '0px';
  toastAnchorBottom: string | null = null;
  toastAnchorLeft: string | null = '0px';
  toastAnchorRight: string | null = null;
  visibility = 'hidden';
  display = 'inline-block';
  // positionType = 'absolute';

  private isShowing = false;
  private newBodyOverflowX$!: Subscription;
  private resizeObs$!: Observable<Event>;
  private resizeSub$!: Subscription | undefined;
  private closeAll$: Subscription | undefined;
  private close$: Subscription | undefined;
  private closeAllInGroup$: Subscription | undefined;
  private closeAllOthers$: Subscription | undefined;
  private closeAllOthersInGroup$: Subscription | undefined;
  private show$: Subscription | undefined;
  private showAll$: Subscription | undefined;
  private showAllOthersInGroup$: Subscription | undefined;
  private goToNextId$: Subscription | undefined;
  private goToPreviousId$: Subscription | undefined;
  private goToFirstId$: Subscription | undefined;
  private goToLastId$: Subscription | undefined;
  private documentInjected!: Document;
  private toastHeight!: number;
  private toastWidth!: number;
  private currentNextElementIndex = 0;
  private isResizing = false;

  private bodyOverflowX!: number;
  private previousBodyOverflowX!: number;

  //toastDestination: the element the toast uses as a reference for the position. E.g. if you hover a button and the toast appears, the button would be the toast destination.
  private toastDestination!: HTMLElement;
  private toastAnchorDomRect!: DOMRect;
  private toastDestinationDomRect!: DOMRect;
  private toastDestinations!: {
    id: string;
    element: HTMLElement;
    position: Position;
    arrows?: Arrows;
  }[];

  private showOnInitDelayTimer: controlledTimer | undefined;
  private hideOnInitDelayTimer: controlledTimer | undefined;
  private hideDelayTimer: controlledTimer | undefined;
  private showDelayTimer: controlledTimer | undefined;
  private displayWasNoneAtStartOfWindowResize = false;
  private firstOfResizeBatch = true;
  private afterViewChecked$ = new Subject<boolean>();
  private runAfterViewCheckedSub = false;
  private updateBodyOverflowX = false;

  @Input() zIndex = 100;
  @Input() animation: boolean | null = null;
  @Input() toastId!: string;
  @Input() toastGroupId: string | undefined;
  //E.g. if a button has position static but is inside a container with position fixed, the effectivePosition would be 'fixed.'
  //This could be calculated. But I don't think traversing parent elements recursively, is good for performance if the developer can easily just add it.
  @Input() effectivePosition: 'other' | 'fixed' | 'sticky' | undefined;
  //When set, toast does not hide on hover out.
  @Input('show') keepShowing = false;

  @Input() showOnHover: boolean | 'mouseenter' = true;
  @Input() hideOnHoverOut: boolean | 'mouseleave' = true;
  @Input() showOnClick = false;
  @Input() hideOnClick = false;
  @Input() toggleOnClick = false;
  @Input() hideOnCustom: string | undefined;
  @Input() showOnCustom: string | undefined;
  @Input() toggleOnCustom: string | undefined;
  @Input() hideDelay = 0;
  @Input() showDelay = 0;
  @Input() showOnInitDelay = 0;
  @Input() hideOnInitDelay = 0;
  @Input() showArrow = true;
  @Input() arrowLeft: boolean | undefined;
  @Input() arrowRight: boolean | undefined;
  @Input() arrowTop: boolean | undefined;
  @Input() arrowBottom: boolean | undefined;
  @Input() position: Position = 'RIGHT';
  @Input() gapInPx: number | undefined;

  @Input() nextElements:
    | {
        id: string;
        position: Position;
        arrows?: Arrows;
      }[]
    | undefined;

  @ViewChild('toast') toastVC!: ElementRef;
  @ViewChild('toastAnchor') toastAnchorVC!: ElementRef;
  @ContentChild('show', { descendants: true }) showCC: ElementRef | undefined;
  @ContentChild('close') closeCC: ElementRef | undefined;

  ngOnInit(): void {
    this.checkInputs();
    this.addDirectiveSubscriptions();
    this.initArrow();

    if (this.showOnInitDelay > 0 || this.hideOnInitDelay > 0) {
      this.keepShowing = true;
    }

    this.addWindowResizeHandler();
  }

  ngAfterContentInit(): void {
    this.addConvenienceClickhandlers();
  }

  ngAfterViewInit(): void {
    console.log('In ViewOnInit');
    this.toastDestination =
      this.toastVC.nativeElement.parentElement.parentElement.parentElement;

    this.addActionEventListeners();

    //setTimeout to avoid error: "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked"
    //300ms delay necessary because Angular renders incorrect offsetHeight if not. The same problem occurs in AfterViewChecked. Thus delay implemented as per lack of other ideas and this stackoverflow answer. https://stackoverflow.com/questions/46637415/angular-4-viewchild-nativeelement-offsetwidth-changing-unexpectedly "This is a common painpoint .."
    setTimeout(() => {
      //get height and width of toast and set them as fixed heights and widths on the toast anchor

      const originalToastHeight = this.toastVC.nativeElement.offsetHeight;
      const originalToastWidth = this.toastVC.nativeElement.offsetWidth;
      this.toastAnchorVC.nativeElement.style.height =
        originalToastHeight + 'px';
      this.toastAnchorVC.nativeElement.style.width = originalToastWidth + 'px';
      console.log(
        '####toast dimensions ' + originalToastHeight + ' ' + originalToastWidth
      );

      this.moveToastToBody();

      console.log('toastDestination below ');
      console.log(this.toastDestination);

      //get coords of the parent to <app-toast>. Toast should show upon hovering this.
      this.toastDestinationDomRect =
        this.toastDestination.getBoundingClientRect();

      this.toastHeight = originalToastHeight;
      this.toastWidth = originalToastWidth;
      // this.toastHeight = this.toastVC.nativeElement.offsetHeight;
      // this.toastWidth = this.toastVC.nativeElement.offsetWidth;

      //definCoords for toastAnchor
      this.defineCoords(this.toastDestinationDomRect);

      //Because we need to read the updated position of toastAnchor
      setTimeout(() => {
        //defineCoords for toast, which is a child of body
        this.toastAnchorDomRect =
          this.toastAnchorVC.nativeElement.getBoundingClientRect() as DOMRect;

        this.toastTop = this.toastAnchorDomRect.top + 'px';
        this.toastLeft = this.toastAnchorDomRect.left + 'px';

        this.initDelayTimers();
        //this.initToastDestinations(); //To do: update this
      }, 0);
    }, 300);
  }

  ngAfterViewChecked(): void {
    console.log('in ngViewChecked - toastId ' + this.toastId);

    //In case the toast content is resized or moved.
    this.updateToastIfToastAnchorDomRectChanged();
    //this.updateToastDestinationDomRectIfChanged();

    // if (this.updateBodyOverflowX) {
    //   this.updateBodyOverflowXIfChanged();
    //   this.updateBodyOverflowX = false;
    // }

    if (this.runAfterViewCheckedSub) {
      this.afterViewChecked$.next(true);
      this.runAfterViewCheckedSub = false;
    }
  }

  ngOnDestroy(): void {
    this.resizeSub$ && this.resizeSub$.unsubscribe();
    this.newBodyOverflowX$ && this.newBodyOverflowX$.unsubscribe();
    this.closeAll$ && this.closeAll$.unsubscribe();
    this.close$ && this.close$.unsubscribe();
    this.closeAllInGroup$ && this.closeAllInGroup$.unsubscribe();
    this.closeAllOthers$ && this.closeAllOthers$.unsubscribe();
    this.closeAllOthersInGroup$ && this.closeAllOthersInGroup$.unsubscribe();
    this.show$ && this.show$.unsubscribe();
    this.showAll$ && this.showAll$.unsubscribe();
    this.showAllOthersInGroup$ && this.showAllOthersInGroup$.unsubscribe();
    this.goToNextId$ && this.goToNextId$.unsubscribe();
    this.goToPreviousId$ && this.goToPreviousId$.unsubscribe();
    this.goToFirstId$ && this.goToFirstId$.unsubscribe();
    this.goToLastId$ && this.goToLastId$.unsubscribe();
  }

  onClose() {
    this.updateShowState(false);

    this.cancelTimers([
      this.hideDelayTimer,
      this.showOnInitDelayTimer,
      this.hideOnInitDelayTimer,
    ]);
  }

  showToast() {
    //Needed because if the user hovers in and out quickly, one timer will be initiated after another. And then maybe a series of show hide behaviour will happen once the user has hovered out.
    this.cancelTimers([
      this.hideDelayTimer,
      this.showOnInitDelayTimer,
      this.hideOnInitDelayTimer,
    ]);

    if (this.showDelay > 0) {
      this.showDelayTimer = this.controllableTimer(this.showDelay);
      this.ngZone.runOutsideAngular(() => {
        this.showDelayTimer!.sub.subscribe({
          complete: () => {
            this.ngZone.run(() => {
              this.updateShowState(true);
            });
          },
        });
      });
    } else {
      this.updateShowState(true);
    }
  }

  hideToast() {
    if (this.showDelayTimer) {
      this.showDelayTimer.cancelTimer = true;
    }

    if (this.hideDelay > 0) {
      this.hideDelayTimer = this.controllableTimer(this.hideDelay);
      this.ngZone.runOutsideAngular(() => {
        this.hideDelayTimer!.sub.subscribe({
          complete: () => {
            this.ngZone.run(() => {
              this.updateShowState(false);
            });
          },
        });
      });
    } else if (!this.keepShowing) {
      this.updateShowState(false);
    }
  }

  goToFirstElement() {
    if (this.toastDestinations.length > 1) {
      this.currentNextElementIndex = 0;
      this.defineNextElement();
    }
  }

  goToLastElement() {
    if (this.toastDestinations.length > 1) {
      this.currentNextElementIndex = this.toastDestinations.length - 1;
      this.defineNextElement();
    }
  }

  goToPreviousElement() {
    if (this.toastDestinations.length > 1) {
      let nextElementIndex = this.currentNextElementIndex - 1;
      if (nextElementIndex < 0) {
        return;
      } else {
        this.currentNextElementIndex = nextElementIndex;
      }

      this.defineNextElement();
    }
  }

  goToNextElement() {
    if (this.toastDestinations.length > 1) {
      //get next object from array and when reach the end, go back to the start
      let nextElementIndex = this.currentNextElementIndex + 1;
      if (nextElementIndex > this.toastDestinations.length - 1) {
        this.currentNextElementIndex = 0;
      } else {
        this.currentNextElementIndex = nextElementIndex;
      }

      this.defineNextElement();
    }
  }

  //E.g. for a timer of 5 seconds, you would use intervalPeriod with a value of 1000 and repetitions with a value of 5.
  controllableTimer(timeInMS: number): {
    sub: Observable<number>;
    isActive: boolean;
    count: number;
    pauseTimer: boolean;
    cancelTimer: boolean;
  } {
    let repetitions = Math.round(timeInMS / 100);
    //object needed so can change these values with this return object from outside this function via a closure.
    let controlObj: {
      sub: Observable<number>;
      isActive: boolean;
      count: number;
      pauseTimer: boolean;
      cancelTimer: boolean;
    } = {
      sub: new Observable(),
      isActive: false,
      count: 0,
      pauseTimer: false,
      cancelTimer: false,
    };

    controlObj.sub = interval(100).pipe(
      tap(() => {
        if (controlObj.count === 0) {
          controlObj.isActive = true;
        }
      }),
      map(() => {
        if (controlObj.pauseTimer) {
          return controlObj.count;
        } else {
          return ++controlObj.count;
        }
      }),
      map((val) => {
        if (controlObj.cancelTimer) {
          controlObj.count = 0;
          controlObj.isActive = false;
          throw new ControlledError(
            'Observable cancelled because cancelTimer set to true'
          );
        } else {
          return val;
        }
      }),

      takeWhile((val) => val <= repetitions),
      finalize(() => {
        controlObj.isActive = false;
        controlObj.count = 0;
        controlObj.pauseTimer = false;
        controlObj.cancelTimer = false;
      })
    );

    return controlObj;
  }

  private compareDOMRectValues(domRectFirst: any, domRectSecond: any) {
    const { x, y, width, height, top, right, bottom, left } = domRectFirst;
    const {
      x: x2,
      y: y2,
      width: width2,
      height: height2,
      top: top2,
      right: right2,
      bottom: bottom2,
      left: left2,
    } = domRectSecond;

    if (x !== x2) {
      return false;
    }
    if (y !== y2) {
      return false;
    }

    if (width !== width2) {
      return false;
    }

    if (height !== height2) {
      return false;
    }

    if (top !== top2) {
      return false;
    }

    if (right !== right2) {
      return false;
    }

    if (bottom !== bottom2) {
      return false;
    }

    if (left !== left2) {
      return false;
    }

    return true;
  }

  private updateToastIfToastAnchorDomRectChanged() {
    if (this.toastAnchorDomRect && !this.isResizing) {
      console.log(
        '### in updateToastIfToastAnchorDomRectChanged if' +
          this.toastAnchorDomRect
      );
      const newToastAnchorDomRect =
        this.toastAnchorVC.nativeElement.getBoundingClientRect() as DOMRect;

      const domRectsAreEqual = this.compareDOMRectValues(
        this.toastAnchorDomRect,
        newToastAnchorDomRect
      );
      if (!domRectsAreEqual) {
        this.toastAnchorDomRect = newToastAnchorDomRect;
        setTimeout(() => {
          this.toastTop = this.toastAnchorDomRect.top + 'px';
          this.toastLeft = this.toastAnchorDomRect.left + 'px';
        }, 0);
      }
    }
  }

  // private updateToastDestinationDomRectIfChanged() {
  //   if (this.toastDestinationDomRect && !this.isResizing) {
  //     const newToastDestinationDomRect =
  //       this.toastDestination.getBoundingClientRect();

  //     const domRectsAreEqual = this.compareDOMRectValues(
  //       this.toastDestinationDomRect,
  //       newToastDestinationDomRect
  //     );
  //     if (!domRectsAreEqual) {
  //       this.toastDestinationDomRect = newToastDestinationDomRect;
  //       setTimeout(() => {
  //         this.defineCoords(this.toastDestinationDomRect);
  //       }, 0);
  //     }
  //   }
  // }

  private accountForOverflowXContentPushingContent() {
    this.bodyOverflowX = this.calcBodyOverflowXWidth();
    // this.toastService.updateBodyOverflowX(this.bodyOverflowX);
    if (this.bodyOverflowX !== this.previousBodyOverflowX) {
      setTimeout(() => {
        this.toastDestinationDomRect =
          this.toastDestination.getBoundingClientRect();

        this.defineCoords(this.toastDestinationDomRect);
        this.initToastDestinations();
        this.previousBodyOverflowX = this.bodyOverflowX;
        this.toastService.updateBodyOverflowX(this.bodyOverflowX);
      }, 0);
    }
  }

  private updateBodyOverflowXIfChanged() {
    this.bodyOverflowX = this.calcBodyOverflowXWidth();
    if (this.bodyOverflowX !== this.previousBodyOverflowX) {
      this.toastService.updateBodyOverflowX(this.calcBodyOverflowXWidth());
    }
  }

  private calcBodyOverflowXWidth() {
    return (
      this.documentInjected.body.scrollWidth -
      this.documentInjected.body.clientWidth
    );
  }

  private addToggleToastListener(
    eventType: string,
    overrideKeepShowing: boolean = false
  ) {
    this.renderer2.listen(
      this.toastVC.nativeElement.parentElement.parentElement.parentElement,
      eventType,
      (e: Event) => {
        if (this.isShowing) {
          if (overrideKeepShowing) {
            this.keepShowing = false;
          }
          this.hideToast();
        } else {
          this.showToast();
        }
      }
    );
  }

  private addShowToastListener(eventType: string) {
    this.renderer2.listen(
      this.toastVC.nativeElement.parentElement.parentElement.parentElement,
      eventType,
      (e: Event) => {
        this.showToast();
      }
    );
  }

  private addHideToastListener(
    eventType: string,
    overrideKeepShowing: boolean = false
  ) {
    this.renderer2.listen(
      this.toastVC.nativeElement.parentElement.parentElement.parentElement,
      eventType,
      (e: Event) => {
        if (overrideKeepShowing) {
          this.keepShowing = false;
        }
        this.hideToast();
      }
    );
  }

  //KeepShowing should not have a setter. Upon initialisation and window resize display must not be set to none even if show is set to false. Visibility:hidden is needed in order to calculate the coordinates of the toast in defineCoords()
  private updateShowState(isShow: boolean) {
    if (isShow) {
      this.bodyOverflowX = this.calcBodyOverflowXWidth();
      this.previousBodyOverflowX = this.bodyOverflowX;

      //Don't set keepShowing to false here. Upon hover out, the tooltip should not continue showing unless KeepShowing is set to true.
      this.display = 'inline-block';
      this.isShowing = true;

      setTimeout(() => {
        this.updateBodyOverflowX = true;
      }, 0);
    } else {
      this.bodyOverflowX = this.calcBodyOverflowXWidth();
      this.previousBodyOverflowX = this.bodyOverflowX;

      this.display = 'none';
      this.isShowing = false;
      this.keepShowing = false;

      setTimeout(() => {
        this.updateBodyOverflowX = true;
      }, 0);
    }
  }

  private cancelTimers(timers: (controlledTimer | undefined)[]) {
    timers.forEach((timer) => {
      if (timer !== undefined && timer !== null) {
        timer.cancelTimer = true;
      }
    });
  }

  private pauseTimers(
    timers: (controlledTimer | undefined)[],
    isPaused: boolean
  ) {
    timers.forEach((timer) => {
      if (timer !== undefined && timer !== null) {
        timer.pauseTimer = isPaused;
      }
    });
  }

  private addActionEventListeners() {
    if (this.showOnHover) {
      if (this.showOnHover === 'mouseenter') {
        this.addShowToastListener('mouseenter');
      } else {
        this.addShowToastListener('mouseover');
      }
    }
    if (this.hideOnHoverOut) {
      if (this.hideOnHoverOut === 'mouseleave') {
        this.addHideToastListener('mouseleave');
      } else {
        this.addHideToastListener('mouseout');
      }
    }
    if (this.toggleOnClick) {
      this.addToggleToastListener('click', true);
    }
    if (this.showOnClick) {
      this.addShowToastListener('click');
    }

    if (this.hideOnClick) {
      this.addHideToastListener('click', true);
    }
    if (this.showOnCustom) {
      this.addShowToastListener(this.showOnCustom);
    }

    if (this.hideOnCustom) {
      this.addHideToastListener(this.hideOnCustom, true);
    }

    if (this.toggleOnCustom) {
      this.addToggleToastListener(this.toggleOnCustom, true);
    }
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

  private initDisplayAndVisibility() {
    //set display to none ASAP to avoid possible jumps in the UI. None found, this is a precaution.
    if (this.keepShowing) {
      this.display = 'inline-block';
      this.isShowing = true;
    } else {
      this.display = 'none';
    }
    this.visibility = 'visible';
  }

  private defineCoords(destinationDomRect: DOMRect) {
    if (this.gapInPx === undefined || this.gapInPx === null) {
      this.gapInPx = 8;
    }

    console.log(
      ' inside defineCoords - toastHeight toastWidth destinationRect' +
        this.toastWidth +
        ' ' +
        this.toastHeight
    );
    console.log(destinationDomRect);

    switch (this.position) {
      case 'LEFT':
        this.toastAnchorLeft = 0 - this.toastWidth - this.gapInPx + 'px';
        this.toastAnchorTop =
          0 - this.toastHeight / 2 + destinationDomRect.height / 2 + 'px';

        break;
      case 'RIGHT':
        this.toastAnchorLeft =
          0 + destinationDomRect.width + this.gapInPx + 'px';
        this.toastAnchorTop =
          0 - this.toastHeight / 2 + destinationDomRect.height / 2 + 'px';

        break;
      case 'TOP':
        this.toastAnchorLeft =
          0 - this.toastWidth / 2 + destinationDomRect.width / 2 + 'px';
        this.toastAnchorTop = 0 - this.toastHeight - this.gapInPx + 'px';
        break;
      case 'BOTTOM':
        this.toastAnchorLeft =
          0 - this.toastWidth / 2 + destinationDomRect.width / 2 + 'px';
        this.toastAnchorTop =
          0 + destinationDomRect.height + this.gapInPx + 'px';
        break;
      default:
        const exhaustiveCheck: never = this.position;
        throw new Error(exhaustiveCheck);
    }

    // switch (this.position) {
    //   case 'LEFT':
    //     this.left =
    //       destinationDomRect.left - this.toastWidth - this.gapInPx + 'px';

    //     this.top =
    //       destinationDomRect.top +
    //       destinationDomRect.height / 2 -
    //       this.toastHeight / 2 +
    //       window.scrollY +
    //       'px';
    //     break;
    //   case 'RIGHT':
    //     this.left =
    //       destinationDomRect.left +
    //       destinationDomRect.width +
    //       this.gapInPx +
    //       'px';
    //     this.top =
    //       destinationDomRect.top +
    //       destinationDomRect.height / 2 -
    //       this.toastHeight / 2 +
    //       window.scrollY +
    //       'px';

    //     break;
    //   case 'TOP':
    //     this.left =
    //       destinationDomRect.left -
    //       this.toastWidth / 2 +
    //       destinationDomRect.width / 2 +
    //       'px';
    //     this.top =
    //       destinationDomRect.top -
    //       this.toastHeight -
    //       this.gapInPx +
    //       window.scrollY +
    //       'px';
    //     break;
    //   case 'BOTTOM':
    //     this.left =
    //       destinationDomRect.left -
    //       this.toastWidth / 2 +
    //       destinationDomRect.width / 2 +
    //       'px';
    //     this.top =
    //       destinationDomRect.top +
    //       destinationDomRect.height +
    //       window.scrollY +
    //       this.gapInPx +
    //       'px';
    //     break;
    //   default:
    //     const exhaustiveCheck: never = this.position;
    //     throw new Error(exhaustiveCheck);
    // }
  }

  private initArrow() {
    if (
      this.arrowTop === undefined &&
      this.arrowBottom === undefined &&
      this.arrowLeft === undefined &&
      this.arrowRight === undefined
    ) {
      this.autoDefineArrow();
    }
  }

  private autoDefineArrow() {
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

  private defineNextElement() {
    const toastDestinationArrows =
      this.toastDestinations[this.currentNextElementIndex].arrows;
    this.toastDestination =
      this.toastDestinations[this.currentNextElementIndex].element;
    this.position =
      this.toastDestinations[this.currentNextElementIndex].position;

    //get the toast dimensions in case they have changed.
    //Perhaps dynamic content was added.
    this.toastHeight = this.toastVC.nativeElement.offsetHeight;
    this.toastWidth = this.toastVC.nativeElement.offsetWidth;

    //ensure previous arrowa are unset
    this.arrowTop = false;
    this.arrowBottom = false;
    this.arrowLeft = false;
    this.arrowRight = false;

    if (toastDestinationArrows === undefined) {
      this.autoDefineArrow();
    } else if (!toastDestinationArrows.includes('NONE')) {
      if (toastDestinationArrows.includes('TOP')) {
        this.arrowTop = true;
      }
      if (toastDestinationArrows.includes('BOTTOM')) {
        this.arrowBottom = true;
      }
      if (toastDestinationArrows.includes('RIGHT')) {
        this.arrowRight = true;
      }
      if (toastDestinationArrows.includes('LEFT')) {
        this.arrowLeft = true;
      }
    }

    const eleDomRect = this.toastDestination.getBoundingClientRect();
    //this.toastDestinationDomRect = eleDomRect; //maybe can remove
    this.defineCoords(eleDomRect);
  }

  private defineHideOnInitDelay() {
    if (this.hideOnInitDelay > 0) {
      this.hideOnInitDelayTimer = this.controllableTimer(this.hideOnInitDelay);

      this.ngZone.runOutsideAngular(() => {
        this.hideOnInitDelayTimer!.sub.subscribe({
          complete: () => {
            this.ngZone.run(() => {
              this.updateShowState(false);
            });
          },
        });
      });
    }
  }

  private initDelayTimers() {
    if (this.showOnInitDelay <= 0) {
      this.initDisplayAndVisibility();
      this.defineHideOnInitDelay();
    } else {
      this.showOnInitDelayTimer = this.controllableTimer(
        Math.abs(this.showOnInitDelay)
      );
      this.ngZone.runOutsideAngular(() => {
        this.showOnInitDelayTimer!.sub.subscribe({
          complete: () => {
            this.ngZone.run(() => {
              this.initDisplayAndVisibility();
              this.defineHideOnInitDelay();
            });
          },
          error: (e: Error) => {
            this.ngZone.run(() => {
              //Can be cancelled by the user clicking or hovering the toast destination before the delay has finished.
              if (e instanceof ControlledError) {
                this.initDisplayAndVisibility();
                //If the user hovers/clicks the toast destination, hideonInitDelay should also be cancelled.
                //Thus we don't call defineHideOninitDelay here
                this.keepShowing = false; //If hover events are enabled and the user hovers the toast destination, the toast closes upon hover-out rather than staying open.
              }
            });
          },
        });
      });
    }
  }

  private showToastFromDirective() {
    //Must update 'KeepShowing' so that if user hovers in and out, the toast does not close
    this.keepShowing = true;
    this.updateShowState(true);
    if (this.showOnInitDelayTimer) {
      this.showOnInitDelayTimer.cancelTimer = true;
    }
  }

  //used with the toast directive so the developer can easily control the toast from components within the toast or outside the toast. E.g. a close a button.
  //These do not respect the hideDelay and showDelay timers. The hideDelay and showDelay timers are for actions (e.g. click, hover...) on the toast destination itself.
  private addDirectiveSubscriptions() {
    if (this.nextElements !== undefined) {
      this.goToNextId$ = this.toastService.goToNextId$.subscribe((e) => {
        this.goToNextElement();
      });
      this.goToPreviousId$ = this.toastService.goToPreviousId$.subscribe(
        (e) => {
          this.goToPreviousElement();
        }
      );
      this.goToFirstId$ = this.toastService.goToFirstId$.subscribe((e) => {
        this.goToFirstElement();
      });
      this.goToLastId$ = this.toastService.goToLastId$.subscribe((e) => {
        this.goToLastElement();
      });
    }

    this.closeAll$ = this.toastService.closeAll$.subscribe((e) => {
      this.onClose();
    });

    this.close$ = this.toastService.close$.subscribe((toastInfo) => {
      if (this.toastId === toastInfo?.toastId) {
        this.onClose();
      }
    });

    this.closeAllOthers$ = this.toastService.closeAllOthers$.subscribe(
      (toastInfo) => {
        if (this.toastId !== toastInfo?.toastId) {
          this.onClose();
        }
      }
    );

    if (this.toastGroupId !== undefined) {
      this.closeAllInGroup$ = this.toastService.closeAllInGroup$.subscribe(
        (toastInfo) => {
          if (this.toastGroupId === toastInfo?.toastGroupId) {
            this.onClose();
          }
        }
      );
    }

    if (this.toastGroupId !== undefined) {
      this.closeAllOthersInGroup$ =
        this.toastService.closeAllOthersInGroup$.subscribe((toastInfo) => {
          if (
            this.toastId !== toastInfo?.toastId &&
            this.toastGroupId === toastInfo?.toastGroupId
          ) {
            this.onClose();
          }
        });
    }

    this.show$ = this.toastService.show$.subscribe((toastInfo) => {
      if (this.toastId === toastInfo?.toastId) {
        this.showToastFromDirective();
      }
    });

    this.showAll$ = this.toastService.showAll$.subscribe((toastInfo) => {
      this.showToastFromDirective();
    });

    this.showAllOthersInGroup$ =
      this.toastService.showAllOthersInGroup$.subscribe((toastInfo) => {
        if (this.toastGroupId === toastInfo?.toastGroupId) {
          this.showToastFromDirective();
        }
      });
  }

  private addWindowResizeHandler() {
    this.resizeObs$ = fromEvent(window, 'resize');
    this.ngZone.runOutsideAngular(() => {
      console.log('### in WindowResizehandler');
      this.resizeSub$ = this.resizeObs$
        .pipe(
          tap(() => {
            this.handleWindowResizeStart();
          }),
          debounceTime(1000)
        )
        .subscribe((e) => {
          this.runAfterViewCheckedSub = true;
          this.ngZone.run(() => {
            this.afterViewChecked$.pipe(take(1)).subscribe(() => {
              setTimeout(() => {
                this.isResizing = false;
                this.handleWindowResizeEnd();
              }, 0);
            });
          });
        });
    });
  }

  private handleWindowResizeStart() {
    if (this.firstOfResizeBatch) {
      this.ngZone.run(() => {
        this.isResizing = true;
        console.log('#### isResizing');
        this.pauseTimers(
          [
            this.showOnInitDelayTimer,
            this.hideOnInitDelayTimer,
            this.showDelayTimer,
            this.hideDelayTimer,
          ],
          true
        );

        if (this.display === 'none') {
          this.displayWasNoneAtStartOfWindowResize = true;
        }
        this.visibility = 'hidden';
        this.display = 'none';
        this.firstOfResizeBatch = false;
      });
    }
  }

  private handleWindowResizeEnd() {
    if (this.displayWasNoneAtStartOfWindowResize) {
      this.display = 'none';
      this.displayWasNoneAtStartOfWindowResize = false;
    } else {
      this.display = 'inline-block';
    }

    if (
      !this.showOnInitDelayTimer?.isActive &&
      !this.showDelayTimer?.isActive
    ) {
      this.visibility = 'visible';
    }

    this.pauseTimers(
      [
        this.showOnInitDelayTimer,
        this.hideOnInitDelayTimer,
        this.showDelayTimer,
        this.hideDelayTimer,
      ],
      false
    );

    this.firstOfResizeBatch = true;
  }

  private initToastDestinations() {
    //get arrows of initial toast in case developer sets custom arrows
    const arrows: ArrowPosition[] = [];
    if (this.arrowTop) {
      arrows.push('TOP');
    }
    if (this.arrowBottom) {
      arrows.push('BOTTOM');
    }
    if (this.arrowLeft) {
      arrows.push('LEFT');
    }
    if (this.arrowRight) {
      arrows.push('RIGHT');
    }
    if (!this.showArrow) {
      arrows.push('NONE');
    }

    this.toastDestinations = [
      {
        id: this.toastId,
        element: this.toastDestination,
        position: this.position,
        //arrows must be an array of at least one value or undefined
        arrows: arrows.length > 0 ? (arrows as Arrows) : undefined,
      },
    ];

    if (this.nextElements && this.nextElements.length > 0) {
      this.nextElements.forEach((ele) => {
        const id = ele.id;
        if (id.toUpperCase() === this.toastId.toUpperCase()) {
          throw Error(
            `Cannot have an id in nextElements that is named the same as the toastID (${this.toastId}) , as the toastId is reserved for the initial toastDestination.`
          );
        }
        const nextEle = this.documentInjected.getElementById(id);
        if (nextEle) {
          this.toastDestinations.push({
            id,
            element: nextEle,
            position: ele.position,
            arrows: ele.arrows,
          });
        }
      });
    }
  }

  //Can add an event to an element by adding the template reference to the element. E.g. #close. Does not work in child components.
  private addConvenienceClickhandlers() {
    if (this.showCC) {
      this.renderer2.listen(
        this.showCC.nativeElement,
        'click',
        (e: MouseEvent) => {
          console.log('dynamically inserted show button was clicked.');
        }
      );
    }
    if (this.closeCC) {
      this.renderer2.listen(
        this.closeCC.nativeElement,
        'click',
        (e: MouseEvent) => {
          this.onClose();
        }
      );
    }
  }

  private checkInputs() {
    if (this.toggleOnClick && (this.hideOnClick || this.showOnClick)) {
      throw Error(
        'You cannot define either hideOnClick or showOnClick at the same time as toggleOnClick'
      );
    }

    if (this.hideOnClick && this.showOnClick) {
      throw Error(
        'You cannot define both hideOnClick and showOnClick. For toggle behaviour, define toggleOnClick and neither showOnClick nor hideOnClick'
      );
    }

    if (!this.toastId) {
      throw Error('You must set the toastId attribute');
    }
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
