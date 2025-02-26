import { Injectable } from '@angular/core';
import { ButtonService } from '../button.service';
import { ButtonFunctionsChild } from '../button-functions-child';

@Injectable({
  providedIn: 'root',
})
export class ButtonChildrenService extends ButtonService {
  constructor() {
    super();
    this.buttonFunctionsChild.mode = 'dark';
  }
  buttonFunctionsChild = new ButtonFunctionsChild();

  getChildButtonFunctions(buttonType: string) {
    if (buttonType === 'buttonFunctionsChild') {
      return this.buttonFunctionsChild;
    } else {
      throw new Error('Unrecognised button type');
    }
    //Here shows how we can have multiple custom buttons in this service and return the desired one.
    //  if (buttonType === 'CTA') {
    //   return this.buttonFunctionsCTA
    // }
  }
}
