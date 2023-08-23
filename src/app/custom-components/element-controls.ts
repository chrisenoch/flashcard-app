import { controlledTimer } from 'src/app/models/interfaces/controlledTimer';
import { cancelTimers } from './controllable-timer';
import { Position } from './toast/models/position';
import { Arrows } from './toast/models/arrows';
import { ElementControlsService } from './element-controls.service';
import { Subscription } from 'rxjs';
import { UpdateShowState, initUpdateShowState } from './element-visibility';

export type ShowElementFromControl = {
  // The props below are what ShowElementFromControl expects to be available on 'this'
  keepShowing: boolean;
  updateShowState: (thisofResidingClass: any, isShow: boolean) => void; //updateShowState: (thisofResidingClass: any. Because ShowElementFromControl is not concerned with which properties updateShowStates expects to be available on this. It just needs to know that it is there.
  showOnInitDelayTimer?: controlledTimer;
  [key: string]: any;
};

export type CloseElementFromControl = {
  updateShowState: (thisofResidingClass: any, isShow: boolean) => void;
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

//used with the element-controls directive so the developer can easily control the element from components within the element or outside the element. E.g. a close a button.
//These do not respect any hideDelay and showDelay timers. The hideDelay and showDelay timers are for actions (e.g. click, hover...) on the element destination itself.
export function addElementControlsSubscriptions(
  thisOfResidingClass: AddElementControlsSubscription
) {
  const self = thisOfResidingClass;
  if (self.nextElements !== undefined) {
    self.subscriptions.push(
      self.elementControlsService.goToNextId$.subscribe((e) => {
        goToNextElement(self);
      })
    );
    self.subscriptions.push(
      self.elementControlsService.goToPreviousId$.subscribe((e) => {
        goToPreviousElement(self);
      })
    );
    self.subscriptions.push(
      self.elementControlsService.goToFirstId$.subscribe((e) => {
        goToFirstElement(self);
      })
    );
    self.subscriptions.push(
      self.elementControlsService.goToLastId$.subscribe((e) => {
        goToLastElement(self);
      })
    );
  }

  self.subscriptions.push(
    self.elementControlsService.closeAll$.subscribe((e) => {
      closeElementFromControl(self);
    })
  );

  self.subscriptions.push(
    self.elementControlsService.close$.subscribe((toastInfo) => {
      if (self.elementId === toastInfo?.elementId) {
        closeElementFromControl(self);
      }
    })
  );

  self.subscriptions.push(
    self.elementControlsService.closeAllOthers$.subscribe((toastInfo) => {
      if (self.elementId !== toastInfo?.elementId) {
        closeElementFromControl(self);
      }
    })
  );

  if (self.elementGroupId !== undefined) {
    self.subscriptions.push(
      self.elementControlsService.closeAllInGroup$.subscribe((toastInfo) => {
        if (self.elementGroupId === toastInfo?.elementGroupId) {
          closeElementFromControl(self);
        }
      })
    );
  }

  if (self.elementGroupId !== undefined) {
    self.subscriptions.push(
      self.elementControlsService.closeAllOthersInGroup$.subscribe(
        (toastInfo) => {
          if (
            self.elementId !== toastInfo?.elementId &&
            self.elementGroupId === toastInfo?.elementGroupId
          ) {
            closeElementFromControl(self);
          }
        }
      )
    );
  }

  self.subscriptions.push(
    self.elementControlsService.show$.subscribe((toastInfo) => {
      if (self.elementId === toastInfo?.elementId) {
        showElementFromControl(self);
      }
    })
  );

  self.subscriptions.push(
    self.elementControlsService.showAll$.subscribe((toastInfo) => {
      showElementFromControl(self);
    })
  );

  self.subscriptions.push(
    self.elementControlsService.showAllOthersInGroup$.subscribe((toastInfo) => {
      if (self.elementGroupId === toastInfo?.elementGroupId) {
        showElementFromControl(self);
      }
    })
  );
}

export function goToNextElement(thisOfResidingClass: GoToElement) {
  const self = thisOfResidingClass;
  if (self.elementDestinations.length > 1) {
    //get next object from array and when reach the end, go back to the start
    let nextElementIndex = self.currentNextElementIndex + 1;
    if (nextElementIndex > self.elementDestinations.length - 1) {
      self.currentNextElementIndex = 0;
    } else {
      self.currentNextElementIndex = nextElementIndex;
    }

    self.defineNextElement();
  }
}

export function goToPreviousElement(thisOfResidingClass: GoToElement) {
  const self = thisOfResidingClass;
  if (self.elementDestinations.length > 1) {
    let nextElementIndex = self.currentNextElementIndex - 1;
    if (nextElementIndex < 0) {
      return;
    } else {
      self.currentNextElementIndex = nextElementIndex;
    }

    self.defineNextElement();
  }
}

export function goToFirstElement(thisOfResidingClass: GoToElement) {
  const self = thisOfResidingClass;
  if (self.elementDestinations.length > 1) {
    self.currentNextElementIndex = 0;
    self.defineNextElement();
  }
}

export function goToLastElement(thisOfResidingClass: GoToElement) {
  const self = thisOfResidingClass;
  if (self.elementDestinations.length > 1) {
    self.currentNextElementIndex = self.elementDestinations.length - 1;
    self.defineNextElement();
  }
}

export function showElementFromControl(
  thisOfResidingClass: ShowElementFromControl
) {
  const self = thisOfResidingClass;
  //Must update 'KeepShowing' so that if user hovers in and out, the element does not close
  self.keepShowing = true;
  //showElementFromControl expects updateShowState to be available on 'this' of the class it is imported into.
  //Also, updateShowState needs to know the value of 'this', so the imported implementation of updateShowState can check that 'this' provides all the properties it needs.
  self.updateShowState(self, true);
  if (self.showOnInitDelayTimer) {
    self.showOnInitDelayTimer.cancelTimer = true;
  }
}

export function closeElementFromControl(
  thisOfResidingClass: CloseElementFromControl
) {
  const self = thisOfResidingClass;
  //closeElementFromControl expects updateShowState to be available on 'this' of the class it is imported into.
  //Also, updateShowState needs to know the value of 'this', so the imported implementation of updateShowState can check that 'this' provides all the properties it needs.
  self.updateShowState(self, false);

  if (
    self.hideDelayTimer ||
    self.showOnInitDelayTimer ||
    self.hideOnInitDelayTimer
  ) {
    cancelTimers([
      self?.hideDelayTimer,
      self?.showOnInitDelayTimer,
      self?.hideOnInitDelayTimer,
    ]);
  }
}
