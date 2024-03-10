import {
  AfterViewChecked,
  AfterViewInit,
  Directive,
  EventEmitter,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { controllableTimer } from '../custom-components/controllable-timer';
import { controlledTimer } from '../models/interfaces/controlledTimer';
import { ControlledError } from '../custom-components/errors/ControlledError';

@Directive({
  selector: '[appInitTimers]',
})
export class InitTimersDirective implements AfterViewInit {
  @Input() showOnInitDelay = 0;
  @Input() hideOnInitDelay = 0;
  @Output() onShowReady = new EventEmitter<true>(true);
  @Output() onHideReady = new EventEmitter<true>(true);
  showOnInitDelayTimer: controlledTimer | undefined;
  hideOnInitDelayTimer: controlledTimer | undefined;

  constructor(private ngZone: NgZone) {}

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
                //to do: callback here
                //this.onShowTimerCancelled.emit();
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
        });
      });
    }
  }
}
