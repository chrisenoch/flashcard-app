import { ElementRef, Renderer2 } from '@angular/core';

export type AddShowElementWithTimersListener = {
  showElementWithTimers: (thisofResidingClass: any) => void;
  renderer2: Renderer2;
  [key: string]: any;
};

export type AddHideElementWithTimersListener = {
  hideElementWithTimers: (thisofResidingClass: any) => void;
  renderer2: Renderer2;
  keepShowing: boolean;
  [key: string]: any;
};

export type AddToggleElementWithTimersListener = {
  hideElementWithTimers: (thisofResidingClass: any) => void;
  showElementWithTimers: (thisofResidingClass: any) => void;
  renderer2: Renderer2;
  isShowing: boolean;
  keepShowing: boolean;
  [key: string]: any;
};

export type InitShowOnHoverListener = {
  addShowElementWithTimersListener: (
    thisofResidingClass: any,
    eventType: string,
    target: HTMLElement
  ) => void;

  elementDestination: HTMLElement;
  showOnHover: boolean | 'mouseenter';

  [key: string]: any;
};

export function initShowOnHoverListener(
  thisofResidingClass: InitShowOnHoverListener
) {
  const self = thisofResidingClass;
  if (self.showOnHover) {
    if (self.showOnHover === 'mouseenter') {
      self.addShowElementWithTimersListener(
        self,
        'mouseenter',
        self.elementDestination
      );
    } else {
      self.addShowElementWithTimersListener(
        self,
        'mouseover',
        self.elementDestination
      );
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
      self.hideElementWithTimers(self);
    } else {
      self.showElementWithTimers(self);
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
    self.hideElementWithTimers(self);
  });
}

export function addShowElementWithTimersListener(
  thisofResidingClass: AddShowElementWithTimersListener,
  eventType: string,
  target: HTMLElement
) {
  const self = thisofResidingClass;
  self.renderer2.listen(target, eventType, (e: Event) => {
    self.showElementWithTimers(self);
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
