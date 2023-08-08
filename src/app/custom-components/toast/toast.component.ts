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

  isShowing = false;
  resizeObs$!: Observable<Event>;
  resizeSub$!: Subscription;
  documentInjected!: Document;
  toastHeight!: number;
  toastWidth!: number;
  count = 0;
  toastDestinationDomRect!: DOMRect;
  originalToastParent!: Element;
  top: string | null = '0px';
  bottom: string | null = null;
  left: string | null = '0px';
  right: string | null = null;
  visibility = 'hidden';
  display = 'inline-block';
  showOnInitDelayTimer: controlledTimer | undefined;
  hideOnInitDelayTimer: controlledTimer | undefined;
  hideDelayTimer: controlledTimer | undefined;
  showDelayTimer: controlledTimer | undefined;
  displayChanged = false;
  firstOfResizeBatch = true;
  afterViewChecked$ = new Subject<boolean>();

  @Input() animation: boolean | null = null;
  @Input() toastId!: string;
  @Input() toastGroupId: string | undefined;
  //Used to programmatically determine if the toast is showing or not.
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
  @Input() position: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM' = 'RIGHT';
  @Input() gapInPx: number | undefined;
  @Input() nextElementId: string | undefined;

  @ViewChild('toast') toastVC!: ElementRef;
  @ContentChild('show', { descendants: true }) showCC: ElementRef | undefined;
  @ContentChild('close') closeCC: ElementRef | undefined;

  goToNextElement(nextElementId: string) {
    console.log('nextElementId: ' + nextElementId);
    const nextEle = this.documentInjected.getElementById(nextElementId);
    if (nextEle) {
      const eleDomRect = nextEle.getBoundingClientRect();
      this.defineCoords(this.toastVC, eleDomRect);
    }
  }

  ngAfterViewChecked(): void {
    console.log('in AfterViewChecked');
    this.afterViewChecked$.next(true);
  }

  ngOnInit(): void {
    this.checkInputs();
    this.addDirectiveSubscriptions();
    this.defineArrow();

    if (this.showOnInitDelay > 0 || this.hideOnInitDelay > 0) {
      this.keepShowing = true;
    }

    this.addWindowResizeHandler();
  }

  ngAfterContentInit(): void {
    this.addConvenienceClickhandlers();
  }

  ngAfterViewInit(): void {
    this.originalToastParent =
      this.toastVC.nativeElement.parentElement.parentElement;
    console.log('originalToastParent ');
    console.log(this.originalToastParent);

    //get coords of the parent to <app-toast>. Toast should show upon hovering this.
    this.toastDestinationDomRect =
      this.originalToastParent.getBoundingClientRect();

    console.log('toastDestinationDOMRect in AfterViewInit');
    console.log(this.toastDestinationDomRect);

    this.addActionEventListeners();

    this.moveToastToBody();

    this.initDelayTimers(this.toastVC);
  }

  ngOnDestroy(): void {
    this.resizeSub$.unsubscribe();
    this.toastService.closeAll$.unsubscribe();
    this.toastService.close$.unsubscribe();
    this.toastService.closeAllInGroup$.unsubscribe();
    this.toastService.closeAllOthers$.unsubscribe();
    this.toastService.closeAllOthersInGroup$.unsubscribe();
    this.toastService.showAll$.unsubscribe();
    this.toastService.showAllOthersInGroup$.unsubscribe();
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
    console.log('in showToast');
    this.cancelTimers([
      this.hideDelayTimer,
      this.showOnInitDelayTimer,
      this.hideOnInitDelayTimer,
    ]);

    if (this.showDelay > 0) {
      this.showDelayTimer = this.controllableTimer(this.showDelay);
      this.showDelayTimer.sub.subscribe({
        complete: () => this.updateShowState(true),
      });
    } else {
      this.updateShowState(true);
    }
  }

  hideToast() {
    console.log('in hideToast');

    if (this.showDelayTimer) {
      this.showDelayTimer.cancelTimer = true;
    }

    if (this.hideDelay > 0) {
      this.hideDelayTimer = this.controllableTimer(this.hideDelay);
      this.hideDelayTimer.sub.subscribe({
        complete: () => this.updateShowState(false),
      });
    } else if (!this.keepShowing) {
      this.updateShowState(false);
    }
  }

  private addToggleToastListener(
    eventType: string,
    overrideKeepShowing: boolean = false
  ) {
    // console.log('isshowing in addtoggle ' + this.isShowing);
    // console.log('keepShowing in addtoggle ' + this.keepShowing);
    this.renderer2.listen(
      this.toastVC.nativeElement.parentElement.parentElement,
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
      this.toastVC.nativeElement.parentElement.parentElement,
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
      this.toastVC.nativeElement.parentElement.parentElement,
      eventType,
      (e: Event) => {
        if (overrideKeepShowing) {
          this.keepShowing = false;
        }
        this.hideToast();
      }
    );
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
          throw Error('Observable cancelled because cancelTimer set to true');
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

  //KeepShowing should not have a setter. Upon initialisation and window resize display must not be set to none even if show is set to false. Visibility:hidden is needed in order to calculate the coordinates of the toast in defineCoords()
  private updateShowState(isShow: boolean) {
    if (isShow) {
      //Don't set keepShowing to false here. Upon hover out, the tooltip should not continue showing unless KeepShowing is set to true.
      this.display = 'inline-block';
      this.isShowing = true;
    } else {
      this.display = 'none';
      this.isShowing = false;
      this.keepShowing = false;
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

  private defineCoords(toast: ElementRef, destinationDomRect: DOMRect) {
    if (this.gapInPx === undefined || this.gapInPx === null) {
      this.gapInPx = 8;
    }

    this.toastHeight = toast.nativeElement.offsetHeight;
    this.toastWidth = toast.nativeElement.offsetWidth;

    console.log('toastWidth and toastHeight');
    console.log(this.toastWidth + ' ' + this.toastHeight);

    switch (this.position) {
      case 'LEFT':
        this.left =
          destinationDomRect.left - this.toastWidth - this.gapInPx + 'px';

        this.top =
          destinationDomRect.top +
          destinationDomRect.height / 2 -
          this.toastHeight / 2 +
          'px';
        break;
      case 'RIGHT':
        this.left =
          destinationDomRect.left +
          destinationDomRect.width +
          this.gapInPx +
          'px';
        this.top =
          destinationDomRect.top +
          destinationDomRect.height / 2 -
          this.toastHeight / 2 +
          'px';

        break;
      case 'TOP':
        this.left =
          destinationDomRect.left -
          this.toastWidth / 2 +
          destinationDomRect.width / 2 +
          'px';
        this.top =
          destinationDomRect.top - this.toastHeight - this.gapInPx + 'px';
        break;
      case 'BOTTOM':
        this.left =
          destinationDomRect.left -
          this.toastWidth / 2 +
          destinationDomRect.width / 2 +
          'px';
        this.top =
          destinationDomRect.top +
          destinationDomRect.height +
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

  private initDelayTimers(toast: ElementRef) {
    //setTimeout to avoid error: "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked"
    //300ms delay necessary because Angular renders incorrect offsetHeight if not. The same problem occurs in AfterViewChecked. Thus delay implemented as per lack of other ideas and this stackoverflow answer. https://stackoverflow.com/questions/46637415/angular-4-viewchild-nativeelement-offsetwidth-changing-unexpectedly "This is a common painpoint .."
    this.showOnInitDelayTimer = this.controllableTimer(
      300 + Math.abs(this.showOnInitDelay)
    );
    this.showOnInitDelayTimer.sub.subscribe({
      complete: () => {
        this.initDisplayAndVisibility();
        this.defineCoords(toast, this.toastDestinationDomRect);
        if (this.hideOnInitDelay > 0) {
          this.hideOnInitDelayTimer = this.controllableTimer(
            this.hideOnInitDelay
          );
          this.hideOnInitDelayTimer.sub.subscribe({
            complete: () => {
              this.updateShowState(false);
            },
          });
        }
      },
    });
  }

  private addDirectiveSubscriptions() {
    if (this.toastGroupId !== undefined) {
      this.toastService.goToNextId$.subscribe((e) => {
        this.goToNextElement(this.nextElementId!);
      });
    }

    this.toastService.closeAll$.subscribe((e) => {
      this.onClose();
    });

    this.toastService.close$.subscribe((toastInfo) => {
      if (this.toastId === toastInfo?.toastId) {
        this.onClose();
      }
    });

    this.toastService.closeAllOthers$.subscribe((toastInfo) => {
      if (this.toastId !== toastInfo?.toastId) {
        this.onClose();
      }
    });

    if (this.toastGroupId !== undefined) {
      this.toastService.closeAllInGroup$.subscribe((toastInfo) => {
        if (this.toastGroupId === toastInfo?.toastGroupId) {
          this.onClose();
        }
      });
    }

    if (this.toastGroupId !== undefined) {
      this.toastService.closeAllOthersInGroup$.subscribe((toastInfo) => {
        if (
          this.toastId !== toastInfo?.toastId &&
          this.toastGroupId === toastInfo?.toastGroupId
        ) {
          this.onClose();
        }
      });
    }

    this.toastService.showAll$.subscribe((e) => {
      //Must update 'show' so that if user hovers in and out, the toast does not close
      this.keepShowing = true;
      this.updateShowState(true);
      if (this.showOnInitDelayTimer) {
        this.showOnInitDelayTimer.cancelTimer = true;
      }
    });

    this.toastService.showAllOthersInGroup$.subscribe((toastInfo) => {
      if (this.toastGroupId === toastInfo?.toastGroupId) {
        //Must update 'show' so that if user hovers in and out, the toast does not close
        this.keepShowing = true;
        this.updateShowState(true);
        if (this.showOnInitDelayTimer) {
          this.showOnInitDelayTimer.cancelTimer = true;
        }
      }
    });
  }

  private addWindowResizeHandler() {
    this.resizeObs$ = fromEvent(window, 'resize');
    this.ngZone.runOutsideAngular(() => {
      this.resizeSub$ = this.resizeObs$
        .pipe(
          tap(() => {
            if (this.firstOfResizeBatch) {
              this.ngZone.run(() => {
                this.pauseTimers(
                  [
                    this.showOnInitDelayTimer,
                    this.hideOnInitDelayTimer,
                    this.showDelayTimer,
                    this.hideDelayTimer,
                  ],
                  true
                );

                this.visibility = 'hidden';
                this.firstOfResizeBatch = false;
                if (this.display === 'none') {
                  this.display = 'inline-block';
                  this.displayChanged = true;
                }
              });
            }
          }),
          debounceTime(1000)
        )
        .subscribe((e) => {
          this.ngZone.run(() => {
            this.afterViewChecked$.pipe(take(1)).subscribe(() => {
              //nested seTimeout needed. If not, does not recover the correct BoundingClientRect.
              setTimeout(() => {
                setTimeout(() => {
                  this.redefineCoords();
                }, 0);
              }, 0);
            });
          });
        });
    });
  }

  private redefineCoords() {
    this.toastDestinationDomRect =
      this.originalToastParent.getBoundingClientRect();

    this.defineCoords(this.toastVC, this.toastDestinationDomRect);

    console.log('toastDestinationDomRect in redefineCoords ');
    console.log(JSON.stringify(this.toastDestinationDomRect));

    //check here which are active
    if (this.displayChanged) {
      this.display = 'none';
      this.displayChanged = false;
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

  //Can add an event to an element by adding the template reference to the element. E.g. #close. Does not work in child components.
  private addConvenienceClickhandlers() {
    if (this.showCC) {
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
