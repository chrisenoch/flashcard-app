import { ElementRef, Renderer2 } from '@angular/core';
import {
  HideElementWithTimers,
  ShowElementWithTimers,
  hideElementWithTimers,
  showElementWithTimers,
} from './element-visibility';

export type AddShowElementWithTimersListener = {
  renderer2: Renderer2;
} & ShowElementWithTimers;

export interface AddShowElementWithTimersListenerArgs
  extends AddShowElementWithTimersListener {}

export type AddHideElementWithTimersListener = {
  renderer2: Renderer2;
  keepShowing: boolean;
} & HideElementWithTimers;

export interface AddHideElementWithTimersListenerArgs
  extends AddHideElementWithTimersListener {}

export type AddToggleElementWithTimersListener = {
  renderer2: Renderer2;
  isShowing: boolean;
  keepShowing: boolean;
} & HideElementWithTimers &
  ShowElementWithTimers;

export interface AddToggleElementWithTimersListenerArgs
  extends AddToggleElementWithTimersListener {}

export type InitShowOnHoverListener = {
  showOnHover: boolean | 'mouseenter';
} & AddShowElementWithTimersListener;

export interface InitShowOnHoverListenerArgs extends InitShowOnHoverListener {}

export type InitHideOnHoverOutListener = {
  hideOnHoverOut: boolean | 'mouseleave';
} & AddHideElementWithTimersListener;

export interface InitHideOnHoverOutListenerArgs
  extends InitHideOnHoverOutListener {}

export type InitToggleOnClickListener = {
  toggleOnClick: boolean;
} & AddToggleElementWithTimersListener;

export interface InitToggleOnClickListenerArgs
  extends InitToggleOnClickListener {}

export type InitHideOnClickListener = {
  hideOnClick: boolean;
} & AddHideElementWithTimersListener;

export interface InitHideOnClickListenerArgs extends InitHideOnClickListener {}

export type InitShowOnClickListener = {
  showOnClick: boolean;
} & AddShowElementWithTimersListener;

export interface InitShowOnClickListenerArgs extends InitShowOnClickListener {}

export type InitShowOnCustomListener = {
  showOnCustom: string | undefined;
} & AddShowElementWithTimersListener;

export interface InitShowOnCustomListenerArgs
  extends InitShowOnCustomListener {}

export type InitHideOnCustomListener = {
  hideOnCustom: string | undefined;
} & AddHideElementWithTimersListener;

export interface InitHideOnCustomListenerArgs
  extends InitHideOnCustomListener {}

export type InitToggleOnCustomListener = {
  toggleOnCustom: string | undefined;
} & AddToggleElementWithTimersListener;

export interface InitToggleOnCustomListenerArgs
  extends InitToggleOnCustomListener {}

export function initToggleOnCustomListener(
  thisOfResidingClass: InitToggleOnCustomListenerArgs,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.toggleOnCustom) {
    addToggleElementWithTimersListener(self, self.toggleOnCustom, target, true);
  }
}

export function initHideOnCustomListener(
  thisOfResidingClass: InitHideOnCustomListenerArgs,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.hideOnCustom) {
    addHideElementWithTimersListener(self, self.hideOnCustom, target, true);
  }
}

export function initShowOnCustomListener(
  thisOfResidingClass: InitShowOnCustomListenerArgs,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.showOnCustom) {
    addShowElementWithTimersListener(self, self.showOnCustom, target);
  }
}

export function initShowOnClickListener(
  thisOfResidingClass: InitShowOnClickListenerArgs,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.showOnClick) {
    addShowElementWithTimersListener(self, 'click', target);
  }
}

export function initHideOnClickListener(
  thisOfResidingClass: InitHideOnClickListenerArgs,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.hideOnClick) {
    addHideElementWithTimersListener(self, 'click', target, true);
  }
}

export function initToggleOnClickListener(
  thisOfResidingClass: InitToggleOnClickListenerArgs,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.toggleOnClick) {
    addToggleElementWithTimersListener(self, 'click', target, true);
  }
}

export function initHideOnHoverOutListener(
  thisOfResidingClass: InitHideOnHoverOutListenerArgs,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.hideOnHoverOut) {
    if (self.hideOnHoverOut === 'mouseleave') {
      addHideElementWithTimersListener(self, 'mouseleave', target);
    } else {
      addHideElementWithTimersListener(self, 'mouseout', target);
    }
  }
}

export function initShowOnHoverListener(
  thisofResidingClass: InitShowOnHoverListenerArgs,
  target: HTMLElement
) {
  const self = thisofResidingClass;
  let unListenFn: (() => void) | null = null;
  if (self.showOnHover) {
    if (self.showOnHover === 'mouseenter') {
      unListenFn = addShowElementWithTimersListener(self, 'mouseenter', target);
    } else {
      unListenFn = addShowElementWithTimersListener(self, 'mouseover', target);
    }
  }
  return unListenFn;
}

export function addToggleElementWithTimersListener(
  thisofResidingClass: AddToggleElementWithTimersListenerArgs,
  eventType: string,
  target: HTMLElement,
  overrideKeepShowing: boolean = false
) {
  const self = thisofResidingClass;
  self.renderer2.listen(target, eventType, (e: Event) => {
    if (self.isShowing) {
      if (overrideKeepShowing) {
        self.keepShowing = false;
      }
      hideElementWithTimers(self);
    } else {
      showElementWithTimers(self);
    }
  });
}

export function addHideElementWithTimersListener(
  thisofResidingClass: AddHideElementWithTimersListenerArgs,
  eventType: string,
  target: HTMLElement,
  overrideKeepShowing: boolean = false
) {
  const self = thisofResidingClass;
  self.renderer2.listen(target, eventType, (e: Event) => {
    if (overrideKeepShowing) {
      self.keepShowing = false;
    }
    hideElementWithTimers(self);
  });
}

export function addShowElementWithTimersListener(
  thisofResidingClass: AddShowElementWithTimersListenerArgs,
  eventType: string,
  target: HTMLElement
): () => void {
  const self = thisofResidingClass;
  const unListenFn = self.renderer2.listen(target, eventType, (e: Event) => {
    showElementWithTimers(self);
  });

  return unListenFn;
}

export function addTransitionEndElementListener(
  host: ElementRef,
  renderer2: Renderer2,
  {
    callback,
    propertiesToFireOn,
  }: {
    callback: () => void;
    propertiesToFireOn: string[];
  }
) {
  renderer2.listen(host, 'transitionend', (e: TransitionEvent) => {
    propertiesToFireOn.forEach((property: string) => {
      if (e.propertyName.toLowerCase() === property.toLowerCase()) {
        callback();
      }
    });
  });
}

//Can add an event to an element by adding the template reference to the element. E.g. #close. Does not work in child components.
export function addConvenienceClickHandler(
  host: ElementRef,
  renderer2: Renderer2,
  callback: () => void
) {
  renderer2.listen(host.nativeElement, 'click', (e: MouseEvent) => {
    callback();
  });
}
