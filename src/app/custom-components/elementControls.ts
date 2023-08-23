import { controlledTimer } from 'src/app/models/interfaces/controlledTimer';
import { cancelTimers } from './controllableTimer';
import { Position } from './toast/models/position';
import { Arrows } from './toast/models/arrows';

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

export type ElementDestinationDetails = {
  id: string;
  elementAnchor: HTMLElement;
  element: HTMLElement;
  position: Position;
  effectivePosition: 'absolute' | 'fixed';
  arrows?: Arrows;
};

// goToFirstElement() {
//   if (this.toastDestinations.length > 1) {
//     this.currentNextElementIndex = 0;
//     this.defineNextElement();
//   }
// }

export type GoToElement = {
  elementDestinations: ElementDestinationDetails[];
  currentNextElementIndex: number;
  defineNextElement: () => void;
  [key: string]: any;
};

export function goToNextElement(thisOfResidingClass: GoToElement) {
  if (thisOfResidingClass.elementDestinations.length > 1) {
    //get next object from array and when reach the end, go back to the start
    let nextElementIndex = thisOfResidingClass.currentNextElementIndex + 1;
    if (nextElementIndex > thisOfResidingClass.elementDestinations.length - 1) {
      thisOfResidingClass.currentNextElementIndex = 0;
    } else {
      thisOfResidingClass.currentNextElementIndex = nextElementIndex;
    }

    thisOfResidingClass.defineNextElement();
  }
}

export function goToPreviousElement(thisOfResidingClass: GoToElement) {
  if (thisOfResidingClass.elementDestinations.length > 1) {
    let nextElementIndex = thisOfResidingClass.currentNextElementIndex - 1;
    if (nextElementIndex < 0) {
      return;
    } else {
      thisOfResidingClass.currentNextElementIndex = nextElementIndex;
    }

    thisOfResidingClass.defineNextElement();
  }
}

export function goToFirstElement(thisOfResidingClass: GoToElement) {
  if (thisOfResidingClass.elementDestinations.length > 1) {
    thisOfResidingClass.currentNextElementIndex = 0;
    thisOfResidingClass.defineNextElement();
  }
}

export function goToLastElement(thisOfResidingClass: GoToElement) {
  if (thisOfResidingClass.elementDestinations.length > 1) {
    thisOfResidingClass.currentNextElementIndex =
      thisOfResidingClass.elementDestinations.length - 1;
    thisOfResidingClass.defineNextElement();
  }
}

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
