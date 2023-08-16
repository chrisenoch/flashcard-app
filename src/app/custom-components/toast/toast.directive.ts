import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToastService } from './toast.service';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Directive({
  selector: '[appToast]',
})
export class ToastDirective implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private element: ElementRef,
    private toastService: ToastService
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

  @Input() toastId!: string;
  @Input() toastGroupId: string | undefined;
  @Input() onClose = false;
  @Input() onToggleShowOther: boolean | undefined = false;
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
    if (!this.toastId) {
      throw Error('You must set the toastId attribute');
    }
  }

  //I chose this approach instead of @HostListener, because this lets me add event listeners conditionally.
  ngAfterViewInit(): void {
    if (this.onCloseAll) {
      this.onCloseAllObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onCloseAllSub$ = this.onCloseAllObs$.subscribe((e) => {
        this.toastService.onCloseAll(e);
      });
    }
    if (this.onClose) {
      this.onCloseObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onCloseSub$ = this.onCloseObs$.subscribe((e) => {
        this.toastService.onClose(e, this.toastId);
      });
    }

    if (this.onToggleShowOther !== undefined) {
      this.onToggleShowOtherObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onToggleShowOtherSub$ = this.onToggleShowOtherObs$.subscribe((e) => {
        if (this.onToggleShowOther) {
          this.toastService.onShow(e, this.toastId);
        } else {
          this.toastService.onClose(e, this.toastId);
        }
      });
    }

    if (this.onCloseAllOthers) {
      this.onCloseAllOthersObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onCloseAllOthersSub$ = this.onCloseAllOthersObs$.subscribe((e) => {
        this.toastService.onCloseAllOthers(e, this.toastId);
      });
    }

    if (this.onCloseAllOthersInGroup !== undefined) {
      this.onCloseAllOthersInGroupObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onCloseAllOthersInGroupSub$ =
        this.onCloseAllOthersInGroupObs$.subscribe((e) => {
          this.toastService.onCloseAllOthersInGroup(
            e,
            this.toastId,
            this.onCloseAllOthersInGroup!
          );
        });
    }

    if (this.onShowAll) {
      this.onShowAllObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onShowAllSub$ = this.onShowAllObs$.subscribe((e) => {
        this.toastService.onShowAll(e);
      });
    }

    if (this.onShowAllOthersInGroup !== undefined) {
      this.onShowAllOthersInGroupObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onShowAllOthersInGroupSub$ =
        this.onShowAllOthersInGroupObs$.subscribe((e) => {
          this.toastService.onShowAllOthersInGroup(
            e,
            this.toastId,
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
        this.toastService.onCloseAllInGroup(e, this.onCloseAllInGroup!);
      });
    }

    if (this.onGoToNextId !== undefined) {
      this.onGoToNextIdObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onGoToNextIdSub$ = this.onGoToNextIdObs$.subscribe((e) => {
        this.toastService.onGoToNextId(e);
      });
    }

    if (this.onGoToPreviousId !== undefined) {
      this.onGoToPreviousIdObs$ = fromEvent(
        this.element.nativeElement,
        'click'
      );
      this.onGoToPreviousIdSub$ = this.onGoToPreviousIdObs$.subscribe((e) => {
        this.toastService.onGoToPreviousId(e);
      });
    }

    if (this.onGoToFirstId !== undefined) {
      this.onGoToFirstIdObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onGoToFirstIdSub$ = this.onGoToFirstIdObs$.subscribe((e) => {
        this.toastService.onGoToFirstId(e);
      });
    }

    if (this.onGoToLastId !== undefined) {
      this.onGoToLastIdObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onGoToLastIdSub$ = this.onGoToLastIdObs$.subscribe((e) => {
        this.toastService.onGoToLastId(e);
      });
    }
  }

  ngOnDestroy(): void {
    console.log('ngONDestroy entered in toast directive');
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
    console.log('end of ngONDestroy entered in toast directive');
  }
}
