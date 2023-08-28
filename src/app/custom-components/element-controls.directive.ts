import { Directive, ElementRef, Input } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { ElementControlsService } from './element-controls.service';

@Directive({
  selector: '[appElementControls]',
})
export class ElementControlsDirective {
  constructor(
    private element: ElementRef,
    private elementControlsService: ElementControlsService
  ) {}

  private onCloseAllObs$: Observable<Event> | undefined;
  private onCloseAllSub$: Subscription | undefined;
  private onCloseAllOthersObs$: Observable<Event> | undefined;
  private onCloseAllOthersSub$: Subscription | undefined;
  private onCloseAllOthersInGroupObs$: Observable<Event> | undefined;
  private onCloseAllOthersInGroupSub$: Subscription | undefined;
  private onCloseAllInGroupObs$: Observable<Event> | undefined;
  private onCloseAllInGroupSub$: Subscription | undefined;
  private onCloseObs$: Observable<Event> | undefined;
  private onCloseSub$: Subscription | undefined;
  private onToggleShowOtherObs$: Observable<Event> | undefined;
  private onToggleShowOtherSub$: Subscription | undefined;
  private onShowAllObs$: Observable<Event> | undefined;
  private onShowAllSub$: Subscription | undefined;
  private onShowAllOthersInGroupObs$: Observable<Event> | undefined;
  private onShowAllOthersInGroupSub$: Subscription | undefined;
  private onGoToNextIdObs$: Observable<Event> | undefined;
  private onGoToNextIdSub$: Subscription | undefined;
  private onGoToPreviousIdObs$: Observable<Event> | undefined;
  private onGoToPreviousIdSub$: Subscription | undefined;
  private onGoToFirstIdObs$: Observable<Event> | undefined;
  private onGoToFirstIdSub$: Subscription | undefined;
  private onGoToLastIdObs$: Observable<Event> | undefined;
  private onGoToLastIdSub$: Subscription | undefined;

  @Input() elementId!: string;
  @Input() elementGroupId: string | undefined;
  @Input() onClose = false;
  @Input() onToggleShowOther: boolean | undefined = undefined;
  @Input() onCloseAll = false;
  @Input() onCloseAllOthers = false;
  @Input() onCloseAllInGroup: string | undefined;
  @Input() onCloseAllOthersInGroup: string | undefined;
  @Input() onShowAll = false;
  @Input() onShowAllOthersInGroup: string | undefined;
  @Input() onGoToNextId: true | undefined;
  @Input() onGoToPreviousId: true | undefined;
  @Input() onGoToFirstId: true | undefined;
  @Input() onGoToLastId: true | undefined;

  ngOnInit(): void {
    if (!this.elementId) {
      throw Error('You must set the elementId attribute');
    }
  }

  //I chose this approach instead of @HostListener, because this lets me add event listeners conditionally.
  ngAfterViewInit(): void {
    if (this.onCloseAll) {
      this.onCloseAllObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onCloseAllSub$ = this.onCloseAllObs$.subscribe((e) => {
        this.elementControlsService.onCloseAll(e);
      });
    }
    if (this.onClose) {
      this.onCloseObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onCloseSub$ = this.onCloseObs$.subscribe((e) => {
        this.elementControlsService.onClose(e, this.elementId);
      });
    }

    if (this.onToggleShowOther !== undefined) {
      this.onToggleShowOtherObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onToggleShowOtherSub$ = this.onToggleShowOtherObs$.subscribe((e) => {
        if (this.onToggleShowOther) {
          this.elementControlsService.onShow(e, this.elementId);
        } else {
          this.elementControlsService.onClose(e, this.elementId);
        }
      });
    }

    if (this.onCloseAllOthers) {
      this.onCloseAllOthersObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onCloseAllOthersSub$ = this.onCloseAllOthersObs$.subscribe((e) => {
        this.elementControlsService.onCloseAllOthers(e, this.elementId);
      });
    }

    if (this.onCloseAllOthersInGroup !== undefined) {
      this.onCloseAllOthersInGroupObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onCloseAllOthersInGroupSub$ =
        this.onCloseAllOthersInGroupObs$.subscribe((e) => {
          this.elementControlsService.onCloseAllOthersInGroup(
            e,
            this.elementId,
            this.onCloseAllOthersInGroup!
          );
        });
    }

    if (this.onShowAll) {
      this.onShowAllObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onShowAllSub$ = this.onShowAllObs$.subscribe((e) => {
        this.elementControlsService.onShowAll(e);
      });
    }

    if (this.onShowAllOthersInGroup !== undefined) {
      this.onShowAllOthersInGroupObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onShowAllOthersInGroupSub$ =
        this.onShowAllOthersInGroupObs$.subscribe((e) => {
          this.elementControlsService.onShowAllOthersInGroup(
            e,
            this.elementId,
            this.onShowAllOthersInGroup!
          );
        });
    }

    if (this.onCloseAllInGroup !== undefined) {
      this.onCloseAllInGroupObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onCloseAllInGroupSub$ = this.onCloseAllInGroupObs$.subscribe((e) => {
        this.elementControlsService.onCloseAllInGroup(
          e,
          this.onCloseAllInGroup!
        );
      });
    }

    if (this.onGoToNextId !== undefined) {
      this.onGoToNextIdObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onGoToNextIdSub$ = this.onGoToNextIdObs$.subscribe((e) => {
        this.elementControlsService.onGoToNextId(e);
      });
    }

    if (this.onGoToPreviousId !== undefined) {
      this.onGoToPreviousIdObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onGoToPreviousIdSub$ = this.onGoToPreviousIdObs$.subscribe((e) => {
        this.elementControlsService.onGoToPreviousId(e);
      });
    }

    if (this.onGoToFirstId !== undefined) {
      this.onGoToFirstIdObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onGoToFirstIdSub$ = this.onGoToFirstIdObs$.subscribe((e) => {
        this.elementControlsService.onGoToFirstId(e);
      });
    }

    if (this.onGoToLastId !== undefined) {
      this.onGoToLastIdObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onGoToLastIdSub$ = this.onGoToLastIdObs$.subscribe((e) => {
        this.elementControlsService.onGoToLastId(e);
      });
    }
  }

  ngOnDestroy(): void {
    this.onCloseAllSub$ && this.onCloseAllSub$.unsubscribe();
    this.onCloseAllOthersSub$ && this.onCloseAllOthersSub$.unsubscribe();
    this.onCloseAllOthersInGroupSub$ &&
      this.onCloseAllOthersInGroupSub$.unsubscribe();
    this.onCloseAllInGroupSub$ && this.onCloseAllInGroupSub$.unsubscribe();
    this.onCloseSub$ && this.onCloseSub$.unsubscribe();
    this.onToggleShowOtherSub$ && this.onToggleShowOtherSub$.unsubscribe();
    this.onShowAllSub$ && this.onShowAllSub$.unsubscribe();
    this.onShowAllOthersInGroupSub$ &&
      this.onShowAllOthersInGroupSub$.unsubscribe();
    this.onGoToNextIdSub$ && this.onGoToNextIdSub$.unsubscribe();
    this.onGoToPreviousIdSub$ && this.onGoToPreviousIdSub$.unsubscribe();
    this.onGoToFirstIdSub$ && this.onGoToFirstIdSub$.unsubscribe();
    this.onGoToLastIdSub$ && this.onGoToLastIdSub$.unsubscribe();
  }
}
