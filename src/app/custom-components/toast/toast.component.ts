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
import { compareDOMRectValues } from '../utilities';
import {
  cancelTimers,
  controllableTimer,
  pauseTimers,
} from '../controllableTimer';
import { addTransitionEndToastListener } from '../elementListeners';
import {
  closeElementFromControl,
  showElementFromControl,
} from '../elementControls';

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
  positionType: 'absolute' | 'fixed' = 'absolute';
  toastCSSClasses: string | undefined;

  private isShowing = false;
  subscriptions: Subscription[] = [];
  private resizeObs$!: Observable<Event>;
  private resizeSub$!: Subscription | undefined;
  private documentInjected!: Document;
  private windowInjected!: (Window & typeof globalThis) | null;
  private toastHeight!: number;
  private toastWidth!: number;
  private currentNextElementIndex = 0;
  private isResizing = false;

  //toastDestination: the element the toast uses as a reference for the position. E.g. if you hover a button and the toast appears, the button would be the toast destination.
  private toastDestination!: HTMLElement;
  private toastAnchorDomRect!: DOMRect;
  private toastDestinationDomRect!: DOMRect;
  private toastDestinations!: {
    id: string;
    toastAnchor: HTMLElement;
    element: HTMLElement;
    position: Position;
    effectivePosition: 'absolute' | 'fixed';
    arrows?: Arrows;
  }[];

  private currentToastAnchor!: HTMLElement;

  showOnInitDelayTimer: controlledTimer | undefined;
  hideOnInitDelayTimer: controlledTimer | undefined;
  hideDelayTimer: controlledTimer | undefined;
  private showDelayTimer: controlledTimer | undefined;
  private displayWasNoneAtStartOfWindowResize = false;
  private firstOfResizeBatch = true;
  private afterViewChecked$ = new Subject<boolean>();
  private runAfterViewCheckedSub = false;
  private runUpdateToastPositionsOnScroll = false;

  @Input() zIndex = 100;
  @Input() animation: boolean | null = null;
  @Input() toastId!: string;
  @Input() toastGroupId: string | undefined;
  //E.g. if a button has position static but is inside a container with position fixed, the effectivePosition would be 'fixed.'
  //This could be calculated. But I don't think traversing parent elements recursively, is good for performance if the developer can easily just add it.
  @Input() effectivePosition!: 'absolute' | 'fixed';
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
  @Input() overrideToastCSSClasses: string | undefined;
  @Input() addToastCSSClasses: string | undefined;
  @Input() toastAnchorCSSClasses: string | undefined;
  @Input() arrowLeftCSSClasses: string | undefined;
  @Input() arrowRightCSSClasses: string | undefined;
  @Input() arrowTopCSSClasses: string | undefined;
  @Input() arrowBottomCSSClasses: string | undefined;
  @Input() onToastTransitionEnd:
    | { callback: () => void; propertiesToFireOn: string[] }
    | undefined = undefined;

  @Input() nextElements:
    | {
        id: string;
        position: Position;
        effectivePosition: 'absolute' | 'fixed';
        arrows?: Arrows;
      }[]
    | undefined;

  @ViewChild('toast') toastVC!: ElementRef;
  @ViewChild('toastAnchor') toastAnchorVC!: ElementRef;
  @ContentChild('show', { descendants: true }) showCC: ElementRef | undefined;
  @ContentChild('close') closeCC: ElementRef | undefined;

  ngOnInit(): void {
    console.log('this');
    console.log(this);

    this.checkInputs();
    this.windowInjected = this.documentInjected.defaultView;
    //ensure toast has correct position type. Perhaps it needs to be 'sticky' or 'fixed.'
    this.initCSS();
    this.initPositionType();
    this.addDirectiveSubscriptions();

    //add scroll event listener
    this.documentInjected.addEventListener('scrollend', () => {
      this.runUpdateToastPositionsOnScroll = true;
    });
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

      this.moveToastToBody();

      //get coords of the parent to <app-toast>. Toast should show upon hovering this.
      this.toastDestinationDomRect =
        this.toastDestination.getBoundingClientRect();

      this.toastHeight = originalToastHeight;
      this.toastWidth = originalToastWidth;

      this.defineToastAnchorCoords(this.toastDestinationDomRect);

      //Because we need to read the updated position of toastAnchor
      setTimeout(() => {
        this.toastAnchorDomRect =
          this.toastAnchorVC.nativeElement.getBoundingClientRect() as DOMRect;

        this.toastTop = this.toastAnchorDomRect.top + 'px';
        this.toastLeft = this.toastAnchorDomRect.left + 'px';

        this.currentToastAnchor = this.toastAnchorVC.nativeElement;

        this.initDelayTimers();
        this.initToastDestinations();
      }, 0);
    }, 300);
  }

  ngAfterViewChecked(): void {
    //console.log('in ngViewChecked - toastId ' + this.toastId);

    if (this.runUpdateToastPositionsOnScroll && this.positionType !== 'fixed') {
      this.updateToastPositionsOnScroll();
      this.runUpdateToastPositionsOnScroll = false;
    }

    //In case the toast destination is resized or moved.
    this.updateToastDestinationDomRectIfChanged();

    if (this.runAfterViewCheckedSub) {
      this.afterViewChecked$.next(true);
      this.runAfterViewCheckedSub = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.resizeSub$ && this.resizeSub$.unsubscribe();
  }

  // closeElementFromControl() {
  //   this.updateShowState(false);

  //   cancelTimers([
  //     this.hideDelayTimer,
  //     this.showOnInitDelayTimer,
  //     this.hideOnInitDelayTimer,
  //   ]);
  // }

  // onClose() {
  //   this.updateShowState(false);

  //   cancelTimers([
  //     this.hideDelayTimer,
  //     this.showOnInitDelayTimer,
  //     this.hideOnInitDelayTimer,
  //   ]);
  // }

  showToast() {
    //Needed because if the user hovers in and out quickly, one timer will be initiated after another. And then maybe a series of show hide behaviour will happen once the user has hovered out.
    cancelTimers([
      this.hideDelayTimer,
      this.showOnInitDelayTimer,
      this.hideOnInitDelayTimer,
    ]);

    if (this.showDelay > 0) {
      this.showDelayTimer = controllableTimer(this.showDelay);
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
      this.hideDelayTimer = controllableTimer(this.hideDelay);
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

  private initCSS() {
    if (this.overrideToastCSSClasses === undefined) {
      this.toastCSSClasses = 'w-max h-fit';
    }
    if (this.addToastCSSClasses) {
      this.toastCSSClasses += ' ' + this.addToastCSSClasses;
    }

    if (this.toastAnchorCSSClasses === undefined) {
      this.toastAnchorCSSClasses = 'absolute';
    }
    if (this.arrowLeftCSSClasses === undefined) {
      this.arrowLeftCSSClasses =
        'absolute top-[50%] left-0 w-0 h-0 border-r-8 -mt-2 -ml-2 border-b-8 border-t-8 border-b-transparent border-t-transparent border-r-gray-400';
    }
    if (this.arrowRightCSSClasses === undefined) {
      this.arrowRightCSSClasses =
        'absolute top-[50%] right-0 w-0 h-0 border-l-8 -mt-2 -mr-2 border-b-8 border-t-8 border-b-transparent border-t-transparent border-l-gray-400';
    }
    if (this.arrowTopCSSClasses === undefined) {
      this.arrowTopCSSClasses =
        'absolute top-0 left-[50%] w-0 h-0 border-r-8 -ml-2 -mt-2 border-b-8 border-l-8 border-b-gray-400 border-r-transparent border-l-transparent';
    }
    if (this.arrowBottomCSSClasses === undefined) {
      this.arrowBottomCSSClasses =
        'absolute right-0 left-[50%] w-0 h-0 border-r-8 -ml-2 -mb-2 border-t-8 border-l-8 border-t-gray-400 border-r-transparent border-l-transparent';
    }
  }

  private updateToastPositionsOnScroll() {
    this.toastAnchorDomRect = this.currentToastAnchor.getBoundingClientRect();
    setTimeout(() => {
      this.toastTop =
        this.toastAnchorDomRect.top + this.windowInjected?.scrollY! + 'px';
      this.toastLeft =
        this.toastAnchorDomRect.left + this.windowInjected?.scrollX! + 'px';
    }, 300);
  }

  private initPositionType() {
    if (
      this.effectivePosition &&
      this.effectivePosition.toLowerCase() === 'fixed'
    ) {
      this.positionType = this.effectivePosition;
    } else {
      this.positionType = 'absolute';
    }
  }

  private updateToastIfToastAnchorDomRectChanged() {
    if (this.toastAnchorDomRect) {
      const newToastAnchorDomRect =
        this.currentToastAnchor.getBoundingClientRect() as DOMRect;

      const domRectsAreEqual = compareDOMRectValues(
        this.toastAnchorDomRect,
        newToastAnchorDomRect
      );
      if (!domRectsAreEqual) {
        this.toastAnchorDomRect = newToastAnchorDomRect;
        this.toastTop = this.toastAnchorDomRect.top + 'px';
        this.toastLeft = this.toastAnchorDomRect.left + 'px';
        // setTimeout(() => {
        //   this.toastTop = this.toastAnchorDomRect.top + 'px';
        //   this.toastLeft = this.toastAnchorDomRect.left + 'px';
        // }, 0);
      }
    }
  }

  private updateToastDestinationDomRectIfChanged() {
    if (this.toastDestinationDomRect && !this.isResizing) {
      const newToastDestinationDomRect =
        this.toastDestination.getBoundingClientRect();

      const domRectsAreEqual = compareDOMRectValues(
        this.toastDestinationDomRect,
        newToastDestinationDomRect
      );
      if (!domRectsAreEqual) {
        this.toastDestinationDomRect = newToastDestinationDomRect;
        setTimeout(() => {
          this.defineToastAnchorCoords(this.toastDestinationDomRect);
          setTimeout(() => {
            this.updateToastIfToastAnchorDomRectChanged();
          }, 0);
        }, 0);
      }
    }
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
  updateShowState(isShow: boolean) {
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

  private addActionEventListeners() {
    if (this.onToastTransitionEnd !== undefined) {
      addTransitionEndToastListener(
        this.toastVC.nativeElement,
        this.renderer2,
        this.onToastTransitionEnd
      );
    }

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

  // private defineCurrentToastAnchorCoords(destinationDomRect: DOMRect) {
  //   const toastAnchors = this.defineToastAnchorCoords(destinationDomRect);
  //   //if 0, the toast is the main toast
  //   if (this.currentNextElementIndex === 0) {
  //     this.toastAnchorTop = toastAnchors.toastAnchorTop;
  //     this.toastAnchorLeft = toastAnchors.toastAnchorLeft;
  //   } else {
  //     //we are dealing with a toast destination
  //     this.currentToastAnchor.style.top = toastAnchors.toastAnchorTop;
  //     this.currentToastAnchor.style.left = toastAnchors.toastAnchorLeft;
  //   }
  // }

  private defineToastAnchorCoords(destinationDomRect: DOMRect) {
    let toastAnchorTop;
    let toastAnchorLeft;

    if (this.gapInPx === undefined || this.gapInPx === null) {
      this.gapInPx = 8;
    }

    switch (this.position) {
      case 'LEFT':
        toastAnchorLeft = 0 - this.toastWidth - this.gapInPx + 'px';
        toastAnchorTop =
          0 - this.toastHeight / 2 + destinationDomRect.height / 2 + 'px';

        break;
      case 'RIGHT':
        toastAnchorLeft = 0 + destinationDomRect.width + this.gapInPx + 'px';
        toastAnchorTop =
          0 - this.toastHeight / 2 + destinationDomRect.height / 2 + 'px';

        break;
      case 'TOP':
        toastAnchorLeft =
          0 - this.toastWidth / 2 + destinationDomRect.width / 2 + 'px';
        toastAnchorTop = 0 - this.toastHeight - this.gapInPx + 'px';
        break;
      case 'BOTTOM':
        toastAnchorLeft =
          0 - this.toastWidth / 2 + destinationDomRect.width / 2 + 'px';
        toastAnchorTop = 0 + destinationDomRect.height + this.gapInPx + 'px';
        break;
      default:
        const exhaustiveCheck: never = this.position;
        throw new Error(exhaustiveCheck);
    }

    //if 0, the toast is the main toast
    if (this.currentNextElementIndex === 0) {
      this.toastAnchorTop = toastAnchorTop;
      this.toastAnchorLeft = toastAnchorLeft;
    } else {
      //we are dealing with a toast destination
      this.currentToastAnchor.style.top = toastAnchorTop;
      this.currentToastAnchor.style.left = toastAnchorLeft;
    }
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
    this.currentToastAnchor =
      this.toastDestinations[this.currentNextElementIndex].toastAnchor;
    this.positionType =
      this.toastDestinations[this.currentNextElementIndex].effectivePosition;

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
    this.toastDestinationDomRect = eleDomRect;

    this.defineToastAnchorCoords(eleDomRect);

    //Because we need to read the updated position of toastAnchor
    setTimeout(() => {
      this.toastAnchorDomRect =
        this.currentToastAnchor.getBoundingClientRect() as DOMRect;

      //Normally we use the onscrollend EventListener along with updateToastPositionsOnScroll# to update the scroll. Here we cannot,
      //as toastAnchorDomRect# retrieved in this method represents the DomRect as it was defined before scroll was considered. If you do not add scrollY and scrollX here, then if the user scrolls, and then clicks on "next toast destination,"
      //the toast will move to the wrong destination because it won't take into account the scroll.
      this.toastTop =
        this.positionType === 'fixed'
          ? this.toastAnchorDomRect.top + 'px'
          : this.toastAnchorDomRect.top + this.windowInjected?.scrollY! + 'px';
      this.toastLeft =
        this.positionType === 'fixed'
          ? this.toastAnchorDomRect.left + 'px'
          : this.toastAnchorDomRect.left + this.windowInjected?.scrollX! + 'px';
    }, 0);
  }

  private defineHideOnInitDelay() {
    if (this.hideOnInitDelay > 0) {
      this.hideOnInitDelayTimer = controllableTimer(this.hideOnInitDelay);

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
      this.showOnInitDelayTimer = controllableTimer(
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

  // private showElementFromControl() {
  //   //Must update 'KeepShowing' so that if user hovers in and out, the toast does not close
  //   this.keepShowing = true;
  //   this.updateShowState(true);
  //   if (this.showOnInitDelayTimer) {
  //     this.showOnInitDelayTimer.cancelTimer = true;
  //   }
  // }

  // private showToastFromDirective() {
  //   //Must update 'KeepShowing' so that if user hovers in and out, the toast does not close
  //   this.keepShowing = true;
  //   this.updateShowState(true);
  //   if (this.showOnInitDelayTimer) {
  //     this.showOnInitDelayTimer.cancelTimer = true;
  //   }
  // }

  //used with the toast directive so the developer can easily control the toast from components within the toast or outside the toast. E.g. a close a button.
  //These do not respect the hideDelay and showDelay timers. The hideDelay and showDelay timers are for actions (e.g. click, hover...) on the toast destination itself.
  private addDirectiveSubscriptions() {
    if (this.nextElements !== undefined) {
      this.subscriptions.push(
        this.toastService.goToNextId$.subscribe((e) => {
          this.goToNextElement();
        })
      );
      this.subscriptions.push(
        this.toastService.goToPreviousId$.subscribe((e) => {
          this.goToPreviousElement();
        })
      );
      this.subscriptions.push(
        this.toastService.goToFirstId$.subscribe((e) => {
          this.goToFirstElement();
        })
      );
      this.subscriptions.push(
        this.toastService.goToLastId$.subscribe((e) => {
          this.goToLastElement();
        })
      );
    }

    this.subscriptions.push(
      this.toastService.closeAll$.subscribe((e) => {
        closeElementFromControl(this);
      })
    );

    this.subscriptions.push(
      this.toastService.close$.subscribe((toastInfo) => {
        if (this.toastId === toastInfo?.toastId) {
          closeElementFromControl(this);
        }
      })
    );

    this.subscriptions.push(
      this.toastService.closeAllOthers$.subscribe((toastInfo) => {
        if (this.toastId !== toastInfo?.toastId) {
          closeElementFromControl(this);
        }
      })
    );

    if (this.toastGroupId !== undefined) {
      this.subscriptions.push(
        this.toastService.closeAllInGroup$.subscribe((toastInfo) => {
          if (this.toastGroupId === toastInfo?.toastGroupId) {
            closeElementFromControl(this);
          }
        })
      );
    }

    if (this.toastGroupId !== undefined) {
      this.subscriptions.push(
        this.toastService.closeAllOthersInGroup$.subscribe((toastInfo) => {
          if (
            this.toastId !== toastInfo?.toastId &&
            this.toastGroupId === toastInfo?.toastGroupId
          ) {
            closeElementFromControl(this);
          }
        })
      );
    }

    this.subscriptions.push(
      this.toastService.show$.subscribe((toastInfo) => {
        if (this.toastId === toastInfo?.toastId) {
          showElementFromControl(this);
        }
      })
    );

    this.subscriptions.push(
      this.toastService.showAll$.subscribe((toastInfo) => {
        showElementFromControl(this);
      })
    );

    this.subscriptions.push(
      this.toastService.showAllOthersInGroup$.subscribe((toastInfo) => {
        if (this.toastGroupId === toastInfo?.toastGroupId) {
          showElementFromControl(this);
        }
      })
    );
  }

  private addWindowResizeHandler() {
    this.resizeObs$ = fromEvent(window, 'resize');
    this.ngZone.runOutsideAngular(() => {
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

        pauseTimers(
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
    //toast size may have changed
    const toastVCHeight = this.toastVC.nativeElement.offsetHeight;
    const toastVCWidth = this.toastVC.nativeElement.offsetWidth;
    this.currentToastAnchor.style.height = toastVCHeight + 'px';
    this.currentToastAnchor.style.width = toastVCWidth + 'px';

    //toastDestintation size may have changed
    this.toastDestinationDomRect =
      this.toastDestination.getBoundingClientRect();
    this.defineToastAnchorCoords(this.toastDestinationDomRect);

    //Because we need to read the updated position of toastAnchor
    setTimeout(() => {
      this.toastAnchorDomRect =
        this.currentToastAnchor.getBoundingClientRect() as DOMRect;

      this.toastTop = this.toastAnchorDomRect.top + 'px';
      this.toastLeft = this.toastAnchorDomRect.left + 'px';

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

      pauseTimers(
        [
          this.showOnInitDelayTimer,
          this.hideOnInitDelayTimer,
          this.showDelayTimer,
          this.hideDelayTimer,
        ],
        false
      );

      this.firstOfResizeBatch = true;
    }, 0);
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

    //store the original toast
    this.toastDestinations = [
      {
        id: this.toastId,
        element: this.toastDestination,
        position: this.position,
        toastAnchor: this.toastAnchorVC.nativeElement,
        effectivePosition: this.effectivePosition,
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
        const nextEleToastAnchor =
          nextEle?.previousElementSibling as HTMLElement;
        if (nextEle && nextEleToastAnchor) {
          this.toastDestinations.push({
            id,
            element: nextEle,
            position: ele.position,
            arrows: ele.arrows,
            toastAnchor: nextEleToastAnchor,
            effectivePosition: ele.effectivePosition,
          });
        }
      });
    }
  }

  //Can add an event to an element by adding the template reference to the element. E.g. #close. Does not work in child components.
  private addConvenienceClickhandlers() {
    if (this.showCC) {
      addConvenienceClickhandler(this.showCC, this.renderer2, () =>
        console.log('clicked show')
      );
    }

    if (this.closeCC) {
      addConvenienceClickhandler(this.closeCC, this.renderer2, () =>
        console.log('clicked close')
      );
    }
  }

  private checkInputs() {
    if (!this.effectivePosition) {
      throw Error(
        'You must set the effectivePosition attribute for toastId: ' +
          this.toastId +
          '. E.g. If the toast destination is a button and it has position:static, but the button is inside a div with position:fixed, the button will behave as if it were position:fixed. Thus the effectivePosition would be fixed.'
      );
    }

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
function addConvenienceClickhandler(
  showCC: ElementRef<any> | undefined,
  renderer2: Renderer2,
  arg2: () => void
) {
  throw new Error('Function not implemented.');
}
