//@ts-nocheck
import { ButtonFunctions } from './button-functions';

export class ButtonFunctionsChild extends ButtonFunctions {
  constructor() {
    super();
    this.addVariantWhenDisabled = false;

    this.component.light.container.disabled = this.disabled;
    this.component.dark.container.disabled = this.disabled;

    this.component.light.container.transform = {
      // Object property refer to the propVariant
      // Values in the Set are the Tailwind classes that get added when the prop variant is selected.
      // E.g. <app-button-child transform="upperCase"/>
      // Here there is only one Tailwind class per Set, but there could be more.
      upperCase: new Set(['uppercase']),
      lowerCase: new Set(['lowercase']),
      normalCase: new Set(['normal-case']),
      capitalize: new Set(['capitalize']),
    };
    this.component.dark.container.transform = this.transform;
  }

  /*
  <propName> = {propVariantOne: new Set([tailwindClass1, tailwindClass2, ...],
                propVariantTwo: new Set([tailwindClass/tailwindClasses])
                }
  This is called transform, but it called be called anything.
  */
  transform = {
    upperCase: new Set(['uppercase']),
    lowerCase: new Set(['lowercase']),
    normalCase: new Set(['normal-case']),
    capitalize: new Set(['capitalize']),
  };

  //change existing prop
  disabled = {
    isDisabled: new Set(['bg-gray-500', 'cursor-cell']),
    isEnabled: new Set(),
  };

  //containerVariantDark = this.component.dark.container.variant;
}
