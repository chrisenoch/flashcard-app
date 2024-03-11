import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  controllableTimer,
  pauseTimers,
} from '../custom-components/controllable-timer';
import { controlledTimer } from '../models/interfaces/controlledTimer';
import { ControlledError } from '../custom-components/errors/ControlledError';
import { Observable, Subscription, debounceTime, fromEvent, tap } from 'rxjs';

@Directive({
  selector: '[appInitTimers]',
})
export class InitTimersDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() showOnInitDelay = 0;
  @Input() hideOnInitDelay = 0;
  @Output() onShowReady = new EventEmitter<true>(true);
  @Output() onHideReady = new EventEmitter<true>(true);

  @Input() set controlShowOnInitDelay(
    control: 'PAUSE' | 'RESUME' | 'CANCEL' | undefined
  ) {
    if (control === 'PAUSE') {
      this.showOnInitDelayTimer &&
        (this.showOnInitDelayTimer.pauseTimer = true);
    }
    if (control === 'RESUME') {
      this.showOnInitDelayTimer &&
        (this.showOnInitDelayTimer.pauseTimer = false);
    }

    if (control === 'CANCEL') {
      this.showOnInitDelayTimer &&
        (this.showOnInitDelayTimer.cancelTimer = true);
    }
  }

  @Input() set controlHideOnInitDelay(
    control: 'PAUSE' | 'RESUME' | 'CANCEL' | undefined
  ) {
    if (control === 'PAUSE') {
      this.hideOnInitDelayTimer &&
        (this.hideOnInitDelayTimer.pauseTimer = true);
    }
    if (control === 'RESUME') {
      this.hideOnInitDelayTimer &&
        (this.hideOnInitDelayTimer.pauseTimer = false);
    }

    if (control === 'CANCEL') {
      this.hideOnInitDelayTimer &&
        (this.hideOnInitDelayTimer.cancelTimer = true);
    }
  }

  showOnInitDelayTimer: controlledTimer | undefined;
  hideOnInitDelayTimer: controlledTimer | undefined;
  private resizeObs$!: Observable<Event>;
  private resizeSub$!: Subscription | undefined;
  private firstOfResizeBatch = true;
  constructor(private ngZone: NgZone) {}
  ngOnInit(): void {
    this.addWindowResizeHandler();
  }

  ngAfterViewInit(): void {
    this.initDelayTimers();
  }

  handleShowReady() {
    console.log('handleshowready called');
    this.onShowReady.emit();
  }

  initDelayTimers() {
    if (this.showOnInitDelay && this.showOnInitDelay <= 0) {
      //to do: callback for when should display
      this.handleShowReady();
      this.defineHideOnInitDelay();
    } else {
      this.showOnInitDelayTimer = this.showOnInitDelay
        ? controllableTimer(Math.abs(this.showOnInitDelay))
        : controllableTimer(0);
      this.ngZone.runOutsideAngular(() => {
        this.showOnInitDelayTimer!.sub.subscribe({
          complete: () => {
            this.ngZone.run(() => {
              //to do: callback for when should display
              this.handleShowReady();
              this.defineHideOnInitDelay();
            });
          },
          error: (e: Error) => {
            this.ngZone.run(() => {
              //Controlled Timer throws error when it is deliberately cancelled. Any other way would result in the 'complete' callback on subscribe being called. I think this is confusing because if the timer has been cancelled it has not completed.
              if (e instanceof ControlledError) {
                //do nothing.
              }
            });
          },
        });
      });
    }
  }

  defineHideOnInitDelay() {
    if (this.hideOnInitDelay && this.hideOnInitDelay > 0) {
      this.hideOnInitDelayTimer = controllableTimer(this.hideOnInitDelay);

      this.ngZone.runOutsideAngular(() => {
        this.hideOnInitDelayTimer!.sub.subscribe({
          complete: () => {
            this.ngZone.run(() => {
              //to do callback
              this.onHideReady.emit();
            });
          },
          error: (e: Error) => {
            this.ngZone.run(() => {
              //Controlled Timer throws error when it is deliberately cancelled. Any other way would result in the 'complete' callback on subscribe being called. I think this is confusing because if the timer has been cancelled it has not completed.
              if (e instanceof ControlledError) {
                //do nothing.
              }
            });
          },
        });
      });
    }
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
          this.ngZone.run(() => {
            this.handleWindowResizeEnd();
          });
        });
    });
  }

  private handleWindowResizeStart() {
    if (this.firstOfResizeBatch) {
      this.ngZone.run(() => {
        pauseTimers(
          [this.showOnInitDelayTimer, this.hideOnInitDelayTimer],
          true
        );
        this.firstOfResizeBatch = false;
      });
    }
  }

  private handleWindowResizeEnd() {
    pauseTimers([this.showOnInitDelayTimer, this.hideOnInitDelayTimer], false);
    this.firstOfResizeBatch = true;
  }

  ngOnDestroy(): void {
    this.resizeSub$ && this.resizeSub$.unsubscribe();
  }
}
