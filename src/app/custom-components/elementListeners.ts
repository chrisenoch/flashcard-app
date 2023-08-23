import { ElementRef, Renderer2 } from '@angular/core';

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
