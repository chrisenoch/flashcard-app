import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  NgZone,
  AfterViewChecked,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  Observable,
  Subscription,
  fromEvent,
  debounceTime,
  tap,
  Subject,
  take,
} from 'rxjs';
import { controlledTimer } from 'src/app/models/interfaces/controlledTimer';
import { Position } from '../models/position';
import { ArrowPosition, Arrows } from '../models/arrows';

import { compareDOMRectValues } from '../utilities';
import { pauseTimers } from '../controllable-timer';
import {
  addConvenienceClickHandler,
  addTransitionEndElementListener,
  initShowOnHoverListener,
  initHideOnHoverOutListener,
  initToggleOnClickListener,
  initShowOnClickListener,
  initHideOnClickListener,
  initShowOnCustomListener,
  initHideOnCustomListener,
  initToggleOnCustomListener,
} from '../element-listeners';
import { addElementControlsSubscriptions } from '../element-controls';
import { ElementControlsService } from '../element-controls.service';
import { initDelayTimers } from '../element-visibility';
import {
  PropertyNamesAsStrings,
  initFields,
} from 'src/app/models/types/getFields';

@Component({
  selector: 'app-tour-guide',
  templateUrl: './tour-guide.component.html',
  styleUrls: ['./tour-guide.component.scss'],
})
export class TourGuideComponent
  implements
    OnInit,
    OnChanges,
    AfterContentInit,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  constructor(
    @Inject(DOCUMENT) document: Document,
    readonly renderer2: Renderer2,
    readonly ngZone: NgZone,
    readonly elementControlsService: ElementControlsService
  ) {
    this.documentInjected = document;
    //A function I created to give typed values for SimpleChanges
    this.f = initFields<typeof this>(this, TourGuideComponent);
  }

  /*We use the word element because the idea is some of this code will be resuable for components such as
a tool-tip, a toast, a snackbar, an alert, a timeline, etc. The word 'element' in variable names refers to the a tool-tip, toast, snackbar,
timeline, etc. In this case it refers to the tour guide.
This tour guide component can be used for all the above cases but is overkill for many of them.
To do: Extract relevant code into separate components and remove features not needed for the above components.
*/
  elementTop: string | null = '0px';
  elementBottom: string | null = null;
  elementLeft: string | null = '0px';
  elementRight: string | null = null;
  elementAnchorTop: string | null = '0px';
  elementAnchorBottom: string | null = null;
  elementAnchorLeft: string | null = '0px';
  elementAnchorRight: string | null = null;
  visibility: 'hidden' | 'visible' = 'hidden';
  display: 'inline-block' | 'none' = 'inline-block';
  positionType: 'absolute' | 'fixed' = 'absolute';
  elementCSSClasses: string | undefined;
  isShowing = false;
  subscriptions: Subscription[] = [];
  //elementDestination: the element the tour-guide uses as a reference for the position. E.g. If you hover a button and the tour-guide appears, the button would be the element destination.
  elementDestination!: HTMLElement;
  elementDestinations!: {
    id: string;
    elementAnchor: HTMLElement;
    element: HTMLElement;
    position: Position;
    effectivePosition: 'absolute' | 'fixed';
    arrows?: Arrows;
  }[];
  currentNextElementIndex = 0;
  showOnInitDelayTimer: controlledTimer | undefined;
  hideOnInitDelayTimer: controlledTimer | undefined;
  hideDelayTimer: controlledTimer | undefined;
  showDelayTimer: controlledTimer | undefined;
  private f: PropertyNamesAsStrings<this>;
  private resizeObs$!: Observable<Event>;
  private resizeSub$!: Subscription | undefined;
  private documentInjected!: Document;
  private windowInjected!: (Window & typeof globalThis) | null;
  private elementHeight!: number;
  private elementWidth!: number;
  private isResizing = false;
  private elementAnchorDomRect!: DOMRect;
  private elementDestinationDomRect!: DOMRect;
  private currentElementAnchor!: HTMLElement;
  private displayWasNoneAtStartOfWindowResize = false;
  private firstOfResizeBatch = true;
  private afterViewChecked$ = new Subject<boolean>();
  private runAfterViewCheckedSub = false;
  private runUpdateElementPositionsOnScroll = false;
  private showOnHoverUnListenFn: null | (() => void) = null;
  private eventUnlistenFns: Map<string, () => void> = new Map();

  @Input() zIndex = 100;
  @Input() animation: boolean | null = null;
  @Input() elementId!: string;
  @Input() elementGroupId: string | undefined;
  //E.g. if a button has position static but is inside a container with position fixed, the effectivePosition would be 'fixed.'
  //This could be calculated. But I don't think traversing parent elements recursively, is good for performance if the developer can easily just add it.
  @Input() effectivePosition!: 'absolute' | 'fixed';
  //When set, element does not hide on hover out.
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
  @Input() overrideElementCSSClasses: string | undefined;
  @Input() addElementCSSClasses: string | undefined;
  @Input() elementAnchorCSSClasses: string | undefined;
  @Input() arrowLeftCSSClasses: string | undefined;
  @Input() arrowRightCSSClasses: string | undefined;
  @Input() arrowTopCSSClasses: string | undefined;
  @Input() arrowBottomCSSClasses: string | undefined;
  @Input() onElementTransitionEnd:
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

  @ViewChild('tourGuide') elementVC!: ElementRef;
  @ViewChild('tourGuideAnchor') elementAnchorVC!: ElementRef;
  @ContentChild('show', { descendants: true }) showCC: ElementRef | undefined;
  @ContentChild('close') closeCC: ElementRef | undefined;

  ngOnInit(): void {
    this.checkInputs();
    this.windowInjected = this.documentInjected.defaultView;
    this.initCSS();
    this.initPositionType();
    addElementControlsSubscriptions(this);

    this.documentInjected.addEventListener('scrollend', () => {
      this.runUpdateElementPositionsOnScroll = true;
    });
    this.initArrow();

    if (this.showOnInitDelay > 0 || this.hideOnInitDelay > 0) {
      this.keepShowing = true;
    }

    this.addWindowResizeHandler();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes[this.f.showOnHover]?.currentValue !==
        changes[this.f.showOnHover]?.previousValue
    ) {
      console.log('show on hover changed');
      if (!this.showOnHover) {
        const unListener = this.eventUnlistenFns.get(this.f.showOnHover);
        unListener && unListener();
      } else if (this.elementDestination) {
        const unListener = initShowOnHoverListener(
          this,
          this.elementDestination
        );
        unListener && this.eventUnlistenFns.set(this.f.showOnHover, unListener);
      }
    }

    console.log('changes below');
    console.log('fields value');
    console.log(this.f.hideOnHoverOut);
    console.log('map below');
    console.log(this.eventUnlistenFns);
    if (
      changes &&
      changes[this.f.hideOnHoverOut]?.currentValue !==
        changes[this.f.hideOnHoverOut]?.previousValue
    ) {
      console.log('show on hover changed');
      if (!this.hideOnHoverOut) {
        const unListener = this.eventUnlistenFns.get(this.f.hideOnHoverOut);
        unListener && unListener();
      } else if (this.elementDestination) {
        const unListener = initHideOnHoverOutListener(
          this,
          this.elementDestination
        );
        unListener &&
          this.eventUnlistenFns.set(this.f.hideOnHoverOut, unListener);
      }
    }
  }

  ngAfterContentInit(): void {
    this.addConvenienceClickhandlers();
  }

  ngAfterViewInit(): void {
    console.log('In ViewOnInit');

    this.elementDestination =
      this.elementVC.nativeElement.parentElement.parentElement.parentElement;

    this.addElementDestinationListeners(this.elementDestination);
    this.addElementListeners();

    //setTimeout to avoid error: "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked"
    //300ms delay necessary because Angular renders incorrect offsetHeight if not. The same problem occurs in AfterViewChecked. Thus delay implemented as per lack of other ideas and this stackoverflow answer. https://stackoverflow.com/questions/46637415/angular-4-viewchild-nativeelement-offsetwidth-changing-unexpectedly "This is a common painpoint .."
    setTimeout(() => {
      //get height and width of the element and set them as fixed heights and widths on the element anchor

      const originalElementHeight = this.elementVC.nativeElement.offsetHeight;
      const originalElementWidth = this.elementVC.nativeElement.offsetWidth;
      this.elementAnchorVC.nativeElement.style.height =
        originalElementHeight + 'px';
      this.elementAnchorVC.nativeElement.style.width =
        originalElementWidth + 'px';

      this.moveElementToBody();

      //get coords of the parent to the element. Element should show upon hovering this.
      this.elementDestinationDomRect =
        this.elementDestination.getBoundingClientRect();

      this.elementHeight = originalElementHeight;
      this.elementWidth = originalElementWidth;

      this.defineElementAnchorCoords(this.elementDestinationDomRect);

      //We need to read the updated position of elementAnchor
      setTimeout(() => {
        this.elementAnchorDomRect =
          this.elementAnchorVC.nativeElement.getBoundingClientRect() as DOMRect;

        this.elementTop = this.elementAnchorDomRect.top + 'px';
        this.elementLeft = this.elementAnchorDomRect.left + 'px';

        this.currentElementAnchor = this.elementAnchorVC.nativeElement;

        initDelayTimers(this);
        this.initElementDestinations();
      }, 0);
    }, 300);
  }

  ngAfterViewChecked(): void {
    if (
      this.runUpdateElementPositionsOnScroll &&
      this.positionType !== 'fixed'
    ) {
      this.updateElementPositionsOnScroll();
      this.runUpdateElementPositionsOnScroll = false;
    }

    //In case the element destination is resized or moved.
    this.updateElementDestinationDomRectIfChanged();

    if (this.runAfterViewCheckedSub) {
      this.afterViewChecked$.next(true);
      this.runAfterViewCheckedSub = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.resizeSub$ && this.resizeSub$.unsubscribe();
  }

  private initCSS() {
    if (this.overrideElementCSSClasses === undefined) {
      this.elementCSSClasses = 'w-max h-fit';
    }
    if (this.addElementCSSClasses) {
      this.elementCSSClasses += ' ' + this.addElementCSSClasses;
    }

    if (this.elementAnchorCSSClasses === undefined) {
      this.elementAnchorCSSClasses = 'absolute';
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

  private updateElementPositionsOnScroll() {
    this.elementAnchorDomRect =
      this.currentElementAnchor.getBoundingClientRect();
    setTimeout(() => {
      this.elementTop =
        this.elementAnchorDomRect.top + this.windowInjected?.scrollY! + 'px';
      this.elementLeft =
        this.elementAnchorDomRect.left + this.windowInjected?.scrollX! + 'px';
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

  private updateElementIfElementAnchorDomRectChanged() {
    if (this.elementAnchorDomRect) {
      const newElementAnchorDomRect =
        this.currentElementAnchor.getBoundingClientRect() as DOMRect;

      const domRectsAreEqual = compareDOMRectValues(
        this.elementAnchorDomRect,
        newElementAnchorDomRect
      );
      if (!domRectsAreEqual) {
        this.elementAnchorDomRect = newElementAnchorDomRect;
        this.elementTop = this.elementAnchorDomRect.top + 'px';
        this.elementLeft = this.elementAnchorDomRect.left + 'px';
        // setTimeout(() => {
        //   this.elementTop = this.elementAnchorDomRect.top + 'px';
        //   this.elementLeft = this.elementAnchorDomRect.left + 'px';
        // }, 0);
      }
    }
  }

  private updateElementDestinationDomRectIfChanged() {
    if (this.elementDestinationDomRect && !this.isResizing) {
      const newElementDestinationDomRect =
        this.elementDestination.getBoundingClientRect();

      const domRectsAreEqual = compareDOMRectValues(
        this.elementDestinationDomRect,
        newElementDestinationDomRect
      );
      if (!domRectsAreEqual) {
        this.elementDestinationDomRect = newElementDestinationDomRect;
        setTimeout(() => {
          this.defineElementAnchorCoords(this.elementDestinationDomRect);
          setTimeout(() => {
            this.updateElementIfElementAnchorDomRectChanged();
          }, 0);
        }, 0);
      }
    }
  }

  private addElementListeners() {
    if (this.onElementTransitionEnd !== undefined) {
      addTransitionEndElementListener(
        this.elementVC.nativeElement,
        this.renderer2,
        this.onElementTransitionEnd
      );
    }
  }

  private addElementDestinationListeners(elementDestination: HTMLElement) {
    console.log('adding element destination listeners');
    const showOnHoverUnListenFn = initShowOnHoverListener(
      this,
      elementDestination
    );
    showOnHoverUnListenFn &&
      this.eventUnlistenFns.set(this.f.showOnHover, showOnHoverUnListenFn);
    //initHideOnHoverOutListener(this, elementDestination);
    const hideOnHoverOutUnListenFn = initHideOnHoverOutListener(
      this,
      elementDestination
    );
    hideOnHoverOutUnListenFn &&
      this.eventUnlistenFns.set(
        this.f.hideOnHoverOut,
        hideOnHoverOutUnListenFn
      );

    initToggleOnClickListener(this, elementDestination);
    initShowOnClickListener(this, elementDestination);
    initHideOnClickListener(this, elementDestination);
    initShowOnCustomListener(this, elementDestination);
    initHideOnCustomListener(this, elementDestination);
    initToggleOnCustomListener(this, elementDestination);
  }

  private moveElementToBody() {
    //alternative: this.elementVC.nativeElement.parentElement.remove();
    this.renderer2.removeChild(
      this.elementVC.nativeElement.parentElement,
      this.elementVC.nativeElement
    );

    this.renderer2.appendChild(
      this.documentInjected.body,
      this.elementVC.nativeElement
    );
  }

  private defineElementAnchorCoords(destinationDomRect: DOMRect) {
    let elementAnchorTop;
    let elementAnchorLeft;

    if (this.gapInPx === undefined || this.gapInPx === null) {
      this.gapInPx = 8;
    }

    switch (this.position) {
      case 'LEFT':
        elementAnchorLeft = 0 - this.elementWidth - this.gapInPx + 'px';
        elementAnchorTop =
          0 - this.elementHeight / 2 + destinationDomRect.height / 2 + 'px';

        break;
      case 'RIGHT':
        elementAnchorLeft = 0 + destinationDomRect.width + this.gapInPx + 'px';
        elementAnchorTop =
          0 - this.elementHeight / 2 + destinationDomRect.height / 2 + 'px';

        break;
      case 'TOP':
        elementAnchorLeft =
          0 - this.elementWidth / 2 + destinationDomRect.width / 2 + 'px';
        elementAnchorTop = 0 - this.elementHeight - this.gapInPx + 'px';
        break;
      case 'BOTTOM':
        elementAnchorLeft =
          0 - this.elementWidth / 2 + destinationDomRect.width / 2 + 'px';
        elementAnchorTop = 0 + destinationDomRect.height + this.gapInPx + 'px';
        break;
      default:
        const exhaustiveCheck: never = this.position;
        throw new Error(exhaustiveCheck);
    }

    //if 0, the element should be positioned relative to the original element destination.
    if (this.currentNextElementIndex === 0) {
      this.elementAnchorTop = elementAnchorTop;
      this.elementAnchorLeft = elementAnchorLeft;
    } else {
      //a different element destination that the element will move to
      this.currentElementAnchor.style.top = elementAnchorTop;
      this.currentElementAnchor.style.left = elementAnchorLeft;
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

  defineNextElement() {
    const elementDestinationArrows =
      this.elementDestinations[this.currentNextElementIndex].arrows;
    this.elementDestination =
      this.elementDestinations[this.currentNextElementIndex].element;
    this.position =
      this.elementDestinations[this.currentNextElementIndex].position;
    this.currentElementAnchor =
      this.elementDestinations[this.currentNextElementIndex].elementAnchor;
    this.positionType =
      this.elementDestinations[this.currentNextElementIndex].effectivePosition;

    //get the element dimensions in case they have changed.
    //Perhaps dynamic content was added.
    this.elementHeight = this.elementVC.nativeElement.offsetHeight;
    this.elementWidth = this.elementVC.nativeElement.offsetWidth;

    //ensure previous arrowa are unset
    this.arrowTop = false;
    this.arrowBottom = false;
    this.arrowLeft = false;
    this.arrowRight = false;

    if (elementDestinationArrows === undefined) {
      this.autoDefineArrow();
    } else if (!elementDestinationArrows.includes('NONE')) {
      if (elementDestinationArrows.includes('TOP')) {
        this.arrowTop = true;
      }
      if (elementDestinationArrows.includes('BOTTOM')) {
        this.arrowBottom = true;
      }
      if (elementDestinationArrows.includes('RIGHT')) {
        this.arrowRight = true;
      }
      if (elementDestinationArrows.includes('LEFT')) {
        this.arrowLeft = true;
      }
    }

    const eleDomRect = this.elementDestination.getBoundingClientRect();
    this.elementDestinationDomRect = eleDomRect;

    this.defineElementAnchorCoords(eleDomRect);

    //We need to read the updated position of elementAnchor
    setTimeout(() => {
      this.elementAnchorDomRect =
        this.currentElementAnchor.getBoundingClientRect() as DOMRect;

      //Normally we use the onscrollend EventListener along with updateElementPositionsOnScroll# to update the scroll. Here we cannot,
      //as elementAnchorDomRect# retrieved in this method represents the DomRect as it was defined before scroll was considered. If you do not add scrollY and scrollX here, then if the user scrolls, and then clicks on "next element destination,"
      //the element will move to the wrong destination because it won't take into account the scroll.
      this.elementTop =
        this.positionType === 'fixed'
          ? this.elementAnchorDomRect.top + 'px'
          : this.elementAnchorDomRect.top +
            this.windowInjected?.scrollY! +
            'px';
      this.elementLeft =
        this.positionType === 'fixed'
          ? this.elementAnchorDomRect.left + 'px'
          : this.elementAnchorDomRect.left +
            this.windowInjected?.scrollX! +
            'px';
    }, 0);
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
    //element size may have changed
    const elementVCHeight = this.elementVC.nativeElement.offsetHeight;
    const elementVCWidth = this.elementVC.nativeElement.offsetWidth;
    this.currentElementAnchor.style.height = elementVCHeight + 'px';
    this.currentElementAnchor.style.width = elementVCWidth + 'px';

    //elementDestintation size may have changed
    this.elementDestinationDomRect =
      this.elementDestination.getBoundingClientRect();
    this.defineElementAnchorCoords(this.elementDestinationDomRect);

    //Because we need to read the updated position of elementAnchor
    setTimeout(() => {
      this.elementAnchorDomRect =
        this.currentElementAnchor.getBoundingClientRect() as DOMRect;

      this.elementTop = this.elementAnchorDomRect.top + 'px';
      this.elementLeft = this.elementAnchorDomRect.left + 'px';

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

  private initElementDestinations() {
    //get arrows of initial element in case developer sets custom arrows
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

    //store the original element
    this.elementDestinations = [
      {
        id: this.elementId,
        element: this.elementDestination,
        position: this.position,
        elementAnchor: this.elementAnchorVC.nativeElement,
        effectivePosition: this.effectivePosition,
        //arrows must be an array of at least one value or undefined
        arrows: arrows.length > 0 ? (arrows as Arrows) : undefined,
      },
    ];

    if (this.nextElements && this.nextElements.length > 0) {
      this.nextElements.forEach((ele) => {
        const id = ele.id;
        if (id.toUpperCase() === this.elementId.toUpperCase()) {
          throw Error(
            `Cannot have an id in nextElements that is named the same as the elementID (${this.elementId}) , as the elementId is reserved for the initial elementDestination.`
          );
        }
        const nextEle = this.documentInjected.getElementById(id);
        const nextEleAnchor = nextEle?.previousElementSibling as HTMLElement;
        if (nextEle && nextEleAnchor) {
          this.elementDestinations.push({
            id,
            element: nextEle,
            position: ele.position,
            arrows: ele.arrows,
            elementAnchor: nextEleAnchor,
            effectivePosition: ele.effectivePosition,
          });
        }
      });
    }
  }

  //Can add an event to an element by adding the template reference to the element. E.g. #close. Does not work in child components.
  private addConvenienceClickhandlers() {
    if (this.showCC) {
      addConvenienceClickHandler(this.showCC, this.renderer2, () =>
        console.log('clicked show')
      );
    }

    if (this.closeCC) {
      addConvenienceClickHandler(this.closeCC, this.renderer2, () =>
        console.log('clicked close')
      );
    }
  }

  private checkInputs() {
    if (!this.effectivePosition) {
      throw Error(
        'You must set the effectivePosition attribute for elementId: ' +
          this.elementId +
          '. E.g. If the element destination is a button and it has position:static, but the button is inside a div with position:fixed, the button will behave as if it were position:fixed. Thus the effectivePosition would be fixed.'
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

    if (!this.elementId) {
      throw Error('You must set the elementId attribute');
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
    console.log('inside accept in tour guide');
  }

  deny() {
    console.log('inside deny in tour guide');
  }
}
