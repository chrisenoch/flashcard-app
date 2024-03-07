//@ts-nocheck
import { ButtonFunctions } from './button-functions';

export class ButtonFunctionsChild extends ButtonFunctions {
  constructor() {
    super();
    this.component.light.container.disabled = {
      isDisabled: new Set(['bg-gray-500', 'cursor-cell']),
      isEnabled: new Set(),
    };
    this.component.dark.container.disabled = {
      isDisabled: new Set(['bg-gray-500', 'cursor-cell']),
      isEnabled: new Set(),
    };
    this.addVariantWhenDisabled = false;

    this.component.light.container.transform = this.transform;
    this.component.dark.container.transform = this.transform;
  }

  transform = {
    upperCase: new Set(['uppercase']),
    lowerCase: new Set(['lowercase']),
    normalCase: new Set(['normal-case']),
    capitalize: new Set(['capitalize']),
  };
}
