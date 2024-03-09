import { Directive, HostListener } from '@angular/core';
import { KeyboardListenerService } from './keyboard-listener.service';

@Directive({
  selector: '[appKeyboardListener]',
})
export class KeyboardListenerDirective {
  constructor(private keyboardListenerService: KeyboardListenerService) {
    console.log('KeyboardListenerDirective init');
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === 'Escape') {
      console.log('escape key pressed');
      this.keyboardListenerService.keyboardEvent$.next('ESCAPE');
    }
  }
}
