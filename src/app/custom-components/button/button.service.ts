import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ButtonFunctions } from './button-functions';

@Injectable({
  providedIn: 'root',
})
export class ButtonService {
  //To do: Inject 'dark' from elsewhere (a config file?) so the developer can set the default mode.
  constructor() {
    this.buttonFunctions.mode = 'light';
  }
  buttonFunctions = new ButtonFunctions();

  mode$ = new Subject<string>();
  updateMode(mode: string) {
    this.mode$.next(mode);
  }

  //To do: protect ButtonFunction so it can't be modified by mistake from outside.
  getButtonFunctions() {
    return this.buttonFunctions;
  }
}
