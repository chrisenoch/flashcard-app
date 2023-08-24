import { ElementRef, Renderer2 } from '@angular/core';
import {
  HideElementWithTimers,
  ShowElementWithTimers,
  hideElementWithTimers,
  showElementWithTimers,
} from './element-visibility';

export type AddShowElementWithTimersListener = {
  renderer2: Renderer2;
  [key: string]: any;
} & ShowElementWithTimers;

export type AddHideElementWithTimersListener = {
  renderer2: Renderer2;
  keepShowing: boolean;
  [key: string]: any;
} & HideElementWithTimers;

export type AddToggleElementWithTimersListener = {
  renderer2: Renderer2;
  isShowing: boolean;
  keepShowing: boolean;
  [key: string]: any;
} & HideElementWithTimers &
  ShowElementWithTimers;

export type InitShowOnHoverListener = {
  showOnHover: boolean | 'mouseenter';

  [key: string]: any;
} & AddShowElementWithTimersListener;

export type InitHideOnHoverOutListener = {
  hideOnHoverOut: boolean | 'mouseleave';

  [key: string]: any;
} & AddHideElementWithTimersListener;

export type InitToggleOnClickListener = {
  toggleOnClick: boolean;

  [key: string]: any;
} & AddToggleElementWithTimersListener;

export type InitHideOnClickListener = {
  hideOnClick: boolean;

  [key: string]: any;
} & AddHideElementWithTimersListener;

export type InitShowOnClickListener = {
  showOnClick: boolean;

  [key: string]: any;
} & AddShowElementWithTimersListener;

export type InitShowOnCustomListener = {
  showOnCustom: string | undefined;

  [key: string]: any;
} & AddShowElementWithTimersListener;

export type InitHideOnCustomListener = {
  hideOnCustom: string | undefined;

  [key: string]: any;
} & AddHideElementWithTimersListener;

export type InitToggleOnCustomListener = {
  toggleOnCustom: string | undefined;

  [key: string]: any;
} & AddToggleElementWithTimersListener;

export function initToggleOnCustomListener(
  thisOfResidingClass: InitToggleOnCustomListener,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.toggleOnCustom) {
    addToggleElementWithTimersListener(self, self.toggleOnCustom, target, true);
  }
}

export function initHideOnCustomListener(
  thisOfResidingClass: InitHideOnCustomListener,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.hideOnCustom) {
    addHideElementWithTimersListener(self, self.hideOnCustom, target, true);
  }
}

export function initShowOnCustomListener(
  thisOfResidingClass: InitShowOnCustomListener,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.showOnCustom) {
    addShowElementWithTimersListener(self, self.showOnCustom, target);
  }
}

export function initShowOnClickListener(
  thisOfResidingClass: InitShowOnClickListener,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.showOnClick) {
    addShowElementWithTimersListener(self, 'click', target);
  }
}

export function initHideOnClickListener(
  thisOfResidingClass: InitHideOnClickListener,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.hideOnClick) {
    addHideElementWithTimersListener(self, 'click', target, true);
  }
}

export function initToggleOnClickListener(
  thisOfResidingClass: InitToggleOnClickListener,
  target: HTMLElement
) {
  const self = thisOfResidingClass;
  if (self.toggleOnClick) {
    addToggleElementWithTimersListener(self, 'click', target, true);
  }
}

export function initHideOnHoverOutListener(
  thisOfResidingClass: InitHideOnHoverOutListener,
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
  thisofResidingClass: InitShowOnHoverListener,
  target: HTMLElement
) {
  const self = thisofResidingClass;
  if (self.showOnHover) {
    if (self.showOnHover === 'mouseenter') {
      addShowElementWithTimersListener(self, 'mouseenter', target);
    } else {
      addShowElementWithTimersListener(self, 'mouseover', target);
    }
  }
}

export function addToggleElementWithTimersListener(
  thisofResidingClass: AddToggleElementWithTimersListener,
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
  thisofResidingClass: AddHideElementWithTimersListener,
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
  thisofResidingClass: AddShowElementWithTimersListener,
  eventType: string,
  target: HTMLElement
) {
  const self = thisofResidingClass;
  self.renderer2.listen(target, eventType, (e: Event) => {
    showElementWithTimers(self);
  });
}

export function addTransitionEndToastListener(
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
