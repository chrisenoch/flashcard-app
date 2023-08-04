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

  onCloseObs$!: Observable<Event>;
  onCloseSub$!: Subscription;

  @Input() onClose = false;
  @Input() toastId!: string;

  // @HostListener('click', ['$event'])
  // close(event: Event) {
  //   console.log('I was clicked - close');
  //   this.toastService.onClose(event);
  // }

  // @HostListener('click', ['$event'])
  // open(event: Event) {
  //   console.log('I was clicked - open');
  //   this.toastService.onOpen(event);
  // }

  ngOnInit(): void {
    if (!this.toastId) {
      throw Error('You must set the toastId attribute');
    }
  }

  //I chose this approach instead of @HostListener, because this lets me add event listeners conditionally.
  ngAfterViewInit(): void {
    if (this.onClose) {
      this.onCloseObs$ = fromEvent(this.element.nativeElement, 'click');
      this.onCloseSub$ = this.onCloseObs$.subscribe((e) => {
        this.toastService.onClose(e);
      });
    }
  }

  ngOnDestroy(): void {
    this.onCloseSub$.unsubscribe();
  }
}
