import { controlledTimer } from 'src/app/models/interfaces/controlledTimer';
import { cancelTimers } from './controllable-timer';
import { Position } from './toast/models/position';
import { Arrows } from './toast/models/arrows';
import { ElementControlsService } from './element-controls.service';
import { Subscription } from 'rxjs';

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

export type GoToElement = {
  elementDestinations: ElementDestinationDetails[];
  currentNextElementIndex: number;
  defineNextElement: () => void;
  [key: string]: any;
};

export type AddElementControlsSubscription = {
  elementId: string;
  elementGroupId: string | undefined;
  elementControlsService: ElementControlsService;
  subscriptions: Subscription[];
  nextElements:
    | {
        id: string;
        position: Position;
        effectivePosition: 'absolute' | 'fixed';
        arrows?: Arrows;
      }[]
    | undefined;
  // goToNextElement: GoToElement;
  // goToPreviousElement: GoToElement;
  // goToFirstElement: GoToElement;
  // goToLastElement: GoToElement;
  // closeElementFromControl: CloseElementFromControl;
  // showElementFromControl: ShowElementFromControl;

  [key: string]: any;
} & GoToElement &
  CloseElementFromControl &
  ShowElementFromControl;

export function addElementControlsSubscriptions(
  thisOfResidingClass: AddElementControlsSubscription
) {
  if (thisOfResidingClass.nextElements !== undefined) {
    thisOfResidingClass.subscriptions.push(
      thisOfResidingClass.elementControlsService.goToNextId$.subscribe((e) => {
        goToNextElement(thisOfResidingClass);
      })
    );
    thisOfResidingClass.subscriptions.push(
      thisOfResidingClass.elementControlsService.goToPreviousId$.subscribe(
        (e) => {
          goToPreviousElement(thisOfResidingClass);
        }
      )
    );
    thisOfResidingClass.subscriptions.push(
      thisOfResidingClass.elementControlsService.goToFirstId$.subscribe((e) => {
        goToFirstElement(thisOfResidingClass);
      })
    );
    thisOfResidingClass.subscriptions.push(
      thisOfResidingClass.elementControlsService.goToLastId$.subscribe((e) => {
        goToLastElement(thisOfResidingClass);
      })
    );
  }

  thisOfResidingClass.subscriptions.push(
    thisOfResidingClass.elementControlsService.closeAll$.subscribe((e) => {
      closeElementFromControl(thisOfResidingClass);
    })
  );

  thisOfResidingClass.subscriptions.push(
    thisOfResidingClass.elementControlsService.close$.subscribe((toastInfo) => {
      if (thisOfResidingClass.elementId === toastInfo?.elementId) {
        closeElementFromControl(thisOfResidingClass);
      }
    })
  );

  thisOfResidingClass.subscriptions.push(
    thisOfResidingClass.elementControlsService.closeAllOthers$.subscribe(
      (toastInfo) => {
        if (thisOfResidingClass.elementId !== toastInfo?.elementId) {
          closeElementFromControl(thisOfResidingClass);
        }
      }
    )
  );

  if (thisOfResidingClass.elementGroupId !== undefined) {
    thisOfResidingClass.subscriptions.push(
      thisOfResidingClass.elementControlsService.closeAllInGroup$.subscribe(
        (toastInfo) => {
          if (
            thisOfResidingClass.elementGroupId === toastInfo?.elementGroupId
          ) {
            closeElementFromControl(thisOfResidingClass);
          }
        }
      )
    );
  }

  if (thisOfResidingClass.elementGroupId !== undefined) {
    thisOfResidingClass.subscriptions.push(
      thisOfResidingClass.elementControlsService.closeAllOthersInGroup$.subscribe(
        (toastInfo) => {
          if (
            thisOfResidingClass.elementId !== toastInfo?.elementId &&
            thisOfResidingClass.elementGroupId === toastInfo?.elementGroupId
          ) {
            closeElementFromControl(thisOfResidingClass);
          }
        }
      )
    );
  }

  thisOfResidingClass.subscriptions.push(
    thisOfResidingClass.elementControlsService.show$.subscribe((toastInfo) => {
      if (thisOfResidingClass.elementId === toastInfo?.elementId) {
        showElementFromControl(thisOfResidingClass);
      }
    })
  );

  thisOfResidingClass.subscriptions.push(
    thisOfResidingClass.elementControlsService.showAll$.subscribe(
      (toastInfo) => {
        showElementFromControl(thisOfResidingClass);
      }
    )
  );

  thisOfResidingClass.subscriptions.push(
    thisOfResidingClass.elementControlsService.showAllOthersInGroup$.subscribe(
      (toastInfo) => {
        if (thisOfResidingClass.elementGroupId === toastInfo?.elementGroupId) {
          showElementFromControl(thisOfResidingClass);
        }
      }
    )
  );
}

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
