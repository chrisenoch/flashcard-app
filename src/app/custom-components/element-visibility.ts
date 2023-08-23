import { NgZone } from '@angular/core';
import { controlledTimer } from '../models/interfaces/controlledTimer';
import { cancelTimers, controllableTimer } from './controllable-timer';

export type UpdateShowState = {
  display: 'inline-block' | 'none';
  isShowing: boolean;
  keepShowing: boolean;
  [key: string]: any;
};

export type InitDisplayAndVisibility = {
  display: 'inline-block' | 'none';
  isShowing: boolean;
  keepShowing: boolean;
  visibility: 'hidden' | 'visible';
  [key: string]: any;
};

export type ShowElementWithTimers = {
  updateShowState: (thisofResidingClass: any, isShow: boolean) => void;
  showOnInitDelayTimer?: controlledTimer;
  hideOnInitDelayTimer?: controlledTimer;
  hideDelayTimer?: controlledTimer;
  showDelayTimer?: controlledTimer;
  showDelay?: number;
  ngZone: NgZone;
  [key: string]: any;
};

export type HideElementWithTimers = {
  updateShowState: (thisofResidingClass: any, isShow: boolean) => void;
  hideDelayTimer?: controlledTimer;
  showDelayTimer?: controlledTimer;
  hideDelay?: number;
  keepShowing: boolean;
  ngZone: NgZone;
  [key: string]: any;
};

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
            self.updateShowState(self, false);
          });
        },
      });
    });
  } else if (!self.keepShowing) {
    self.updateShowState(self, false);
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
            self.updateShowState(self, true);
          });
        },
      });
    });
  } else {
    self.updateShowState(self, true);
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
