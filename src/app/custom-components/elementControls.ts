import { controlledTimer } from 'src/app/models/interfaces/controlledTimer';
import { cancelTimers } from './controllableTimer';

export type ShowElementFromControl = {
  keepShowing: boolean;
  updateShowState: (isShow: boolean) => void;
  showOnInitDelayTimer?: controlledTimer;
  [key: string]: any;
};

export type CloseElementFromControl = {
  updateShowState: (isShow: boolean) => void;
  showOnInitDelayTimer?: controlledTimer;
  hideOnInitDelayTimer?: controlledTimer;
  hideDelayTimer?: controlledTimer;
  [key: string]: any;
};

export function showElementFromControl(
  thisOfResidingClass: ShowElementFromControl
) {
  //Must update 'KeepShowing' so that if user hovers in and out, the element does not close
  thisOfResidingClass.keepShowing = true;
  thisOfResidingClass.updateShowState(true);
  if (thisOfResidingClass.showOnInitDelayTimer) {
    thisOfResidingClass.showOnInitDelayTimer.cancelTimer = true;
  }
}

export function closeElementFromControl(
  thisOfResidingClass: CloseElementFromControl
) {
  thisOfResidingClass.updateShowState(false);

  console.log('in closeElementFromControl');

  if (
    thisOfResidingClass.hideDelayTimer ||
    thisOfResidingClass.showOnInitDelayTimer ||
    thisOfResidingClass.hideOnInitDelayTimer
  ) {
    cancelTimers([
      thisOfResidingClass?.hideDelayTimer,
      thisOfResidingClass?.showOnInitDelayTimer,
      thisOfResidingClass?.hideOnInitDelayTimer,
    ]);
  }
}
