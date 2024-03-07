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
  }
}
