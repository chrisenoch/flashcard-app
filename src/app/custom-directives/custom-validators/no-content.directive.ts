import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector: '[appNoContent]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoContentDirective,
      multi: true,
    },
  ],
})
//Needed because password.errors?.['minlength'] only activates when there is some content in the input. I want to show the
//error message even if there is no content. See Sign-In component for an example.
export class NoContentDirective implements Validator {
  validate(control: AbstractControl<String | null>): ValidationErrors | null {
    if (!control.value || control.value.length < 1) {
      return {
        noContent: true,
      };
    } else {
      return null;
    }
  }
}
