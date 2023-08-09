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

  onCloseAllObs$!: Observable<Event>;
  onCloseAllSub$!: Subscription;
  onCloseAllOthersObs$!: Observable<Event>;
  onCloseAllOthersSub$!: Subscription;
  onCloseAllOthersInGroupObs$!: Observable<Event>;
  onCloseAllOthersInGroupSub$!: Subscription;
  onCloseAllInGroupObs$!: Observable<Event>;
  onCloseAllInGroupSub$!: Subscription;
  onCloseObs$!: Observable<Event>;
  onCloseSub$!: Subscription;
  onShowAllObs$!: Observable<Event>;
  onShowAllSub$!: Subscription;
  onShowAllOthersInGroupObs$!: Observable<Event>;
  onShowAllOthersInGroupSub$!: Subscription;
  onGoToNextIdObs$!: Observable<Event>;
  onGoToNextIdSub$!: Subscription;
  onGoToPreviousIdObs$!: Observable<Event>;
  onGoToPreviousIdSub$!: Subscription;
  onGoToFirstIdObs$!: Observable<Event>;
  onGoToFirstIdSub$!: Subscription;
  onGoToLastIdObs$!: Observable<Event>;
  onGoToLastIdSub$!: Subscription;

  @Input() toastId!: string;
  @Input() toastGroupId: string | undefined;
  @Input() onClose = false;
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
    this.onCloseAllSub$.unsubscribe();
    this.onCloseAllOthersSub$.unsubscribe();
    this.onCloseAllOthersInGroupSub$.unsubscribe();
    this.onCloseAllInGroupSub$.unsubscribe();
    this.onCloseSub$.unsubscribe();
    this.onShowAllSub$.unsubscribe();
    this.onShowAllOthersInGroupSub$.unsubscribe();
    this.onGoToNextIdSub$.unsubscribe();
    this.onGoToPreviousIdSub$.unsubscribe();
    this.onGoToFirstIdSub$.unsubscribe();
    this.onGoToLastIdSub$.unsubscribe();
  }
}
