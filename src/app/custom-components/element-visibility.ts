import { NgZone } from '@angular/core';
import { controlledTimer } from '../models/interfaces/controlledTimer';
import { cancelTimers, controllableTimer } from './controllable-timer';
import { ControlledError } from './errors/ControlledError';

export type UpdateShowState = {
  display: 'inline-block' | 'none';
  isShowing: boolean;
  keepShowing: boolean;
};

export type InitDisplayAndVisibility = {
  display: 'inline-block' | 'none';
  isShowing: boolean;
  keepShowing: boolean;
  visibility: 'hidden' | 'visible';
};

export type ShowElementWithTimers = {
  showOnInitDelayTimer?: controlledTimer;
  hideOnInitDelayTimer?: controlledTimer;
  hideDelayTimer?: controlledTimer;
  showDelayTimer?: controlledTimer;
  showDelay?: number;
  ngZone: NgZone;
} & UpdateShowState;

export type HideElementWithTimers = {
  hideDelayTimer?: controlledTimer;
  showDelayTimer?: controlledTimer;
  hideDelay?: number;
  keepShowing: boolean;
  ngZone: NgZone;
} & UpdateShowState;

export type InitDelayTimers = {
  showOnInitDelayTimer?: controlledTimer;
  showOnInitDelay?: number;
  keepShowing: boolean;
  ngZone: NgZone;
} & InitDisplayAndVisibility &
  DefineHideOnInitDelay;

export type DefineHideOnInitDelay = {
  hideOnInitDelayTimer?: controlledTimer;
  hideOnInitDelay?: number;
  ngZone: NgZone;
} & UpdateShowState;

export function initDelayTimers(thisOfResidingClass: InitDelayTimers) {
  const self = thisOfResidingClass;
  if (self.showOnInitDelay && self.showOnInitDelay <= 0) {
    initDisplayAndVisibility(self);
    defineHideOnInitDelay(self);
  } else {
    self.showOnInitDelayTimer = self.showOnInitDelay
      ? controllableTimer(Math.abs(self.showOnInitDelay))
      : controllableTimer(0);
    self.ngZone.runOutsideAngular(() => {
      self.showOnInitDelayTimer!.sub.subscribe({
        complete: () => {
          self.ngZone.run(() => {
            initDisplayAndVisibility(self);
            defineHideOnInitDelay(self);
          });
        },
        error: (e: Error) => {
          self.ngZone.run(() => {
            //Can be cancelled by the user clicking or hovering the toast destination before the delay has finished.
            if (e instanceof ControlledError) {
              initDisplayAndVisibility(self);
              //If the user hovers/clicks the toast destination, hideonInitDelay should also be cancelled.
              //Thus we don't call defineHideOninitDelay here
              self.keepShowing = false; //If hover events are enabled and the user hovers the toast destination, the toast closes upon hover-out rather than staying open.
            }
          });
        },
      });
    });
  }
}

export function defineHideOnInitDelay(
  thisOfResidingClass: DefineHideOnInitDelay
) {
  const self = thisOfResidingClass;
  if (self.hideOnInitDelay && self.hideOnInitDelay > 0) {
    self.hideOnInitDelayTimer = controllableTimer(self.hideOnInitDelay);

    self.ngZone.runOutsideAngular(() => {
      self.hideOnInitDelayTimer!.sub.subscribe({
        complete: () => {
          self.ngZone.run(() => {
            updateShowState(self, false);
          });
        },
      });
    });
  }
}

export function hideElementWithTimers(
  thisOfResidingClass: HideElementWithTimers
) {
  const self = thisOfResidingClass;
  if (self.showDelayTimer) {
    self.showDelayTimer.cancelTimer = true;
  }

  if (self.hideDelay && self.hideDelay > 0) {
    self.hideDelayTimer = controllableTimer(self.hideDelay);
    self.ngZone.runOutsideAngular(() => {
      self.hideDelayTimer!.sub.subscribe({
        complete: () => {
          self.ngZone.run(() => {
            updateShowState(self, false);
          });
        },
      });
    });
  } else if (!self.keepShowing) {
    updateShowState(self, false);
  }
}

export function showElementWithTimers(
  thisOfResidingClass: ShowElementWithTimers
) {
  const self = thisOfResidingClass;
  //Needed because if the user hovers in and out quickly, one timer will be initiated after another. And then maybe a series of show hide behaviour will happen once the user has hovered out.
  cancelTimers([
    self.hideDelayTimer,
    self.showOnInitDelayTimer,
    self.hideOnInitDelayTimer,
  ]);

  if (self.showDelay && self.showDelay > 0) {
    self.showDelayTimer = controllableTimer(self.showDelay);
    self.ngZone.runOutsideAngular(() => {
      self.showDelayTimer!.sub.subscribe({
        complete: () => {
          self.ngZone.run(() => {
            updateShowState(self, true);
          });
        },
      });
    });
  } else {
    updateShowState(self, true);
  }
}

export function initDisplayAndVisibility(
  thisOfResidingClass: InitDisplayAndVisibility
) {
  const self = thisOfResidingClass;
  if (self.keepShowing) {
    self.display = 'inline-block';
    self.isShowing = true;
  } else {
    self.display = 'none';
  }
  self.visibility = 'visible';
}

//KeepShowing should not have a setter. Upon initialisation and window resize display must not be set to none even if show is set to false. Visibility:hidden is needed in order to calculate the coordinates of the toast in defineCoords()
export function updateShowState(
  thisOfResidingClass: UpdateShowState,
  isShow: boolean
) {
  const self = thisOfResidingClass;
  if (isShow) {
    //Don't set keepShowing to false here. Upon hover out, the tooltip should not continue showing unless KeepShowing is set to true.
    self.display = 'inline-block';
    self.isShowing = true;
  } else {
    self.display = 'none';
    self.isShowing = false;
    self.keepShowing = false;
  }
}
