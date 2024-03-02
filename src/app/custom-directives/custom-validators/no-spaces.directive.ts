import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector: '[appNoSpaces]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoSpacesDirective,
      multi: true,
    },
  ],
})
export class NoSpacesDirective implements Validator {
  validate(control: AbstractControl<String | null>): ValidationErrors | null {
    if (!control.value) {
      return null;
    } else {
      const hasSpaces = control.value.indexOf(' ') !== -1;
      if (hasSpaces) {
        return {
          hasSpaces: true,
        };
      }
      return null;
    }
  }
}
