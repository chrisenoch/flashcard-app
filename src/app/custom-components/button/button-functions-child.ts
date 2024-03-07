//@ts-nocheck
import { ButtonFunctions } from './button-functions';

export class ButtonFunctionsChild extends ButtonFunctions {
  constructor() {
    super();
    this.addVariantWhenDisabled = false;

    this.component.light.container.disabled = this.disabled;
    this.component.light.container.transform = this.transform;

    this.component.dark.container.disabled = this.disabled;
    this.component.dark.container.transform = this.transform;
  }

  //change existing variant
  disabled = {
    isDisabled: new Set(['bg-gray-500', 'cursor-cell']),
    isEnabled: new Set(),
  };

  //extra variant that does not exist on parent ButtonComponent
  transform = {
    upperCase: new Set(['uppercase']),
    lowerCase: new Set(['lowercase']),
    normalCase: new Set(['normal-case']),
    capitalize: new Set(['capitalize']),
  };
}
