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
  onCloseObs$!: Observable<Event>;
  onCloseSub$!: Subscription;
  onShowAllObs$!: Observable<Event>;
  onShowAllSub$!: Subscription;

  @Input() onCloseAll = false;
  @Input() onClose = false;
  @Input() onShowAll = false;
  @Input() toastId!: string;

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

    if (this.onShowAll) {
      this.onShowAllObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onShowAllSub$ = this.onShowAllObs$.subscribe((e) => {
        this.toastService.onShowAll(e);
      });
    }
  }

  ngOnDestroy(): void {
    this.onCloseAllSub$.unsubscribe();
    this.onCloseSub$.unsubscribe();
    this.onShowAllSub$.unsubscribe();
  }
}
