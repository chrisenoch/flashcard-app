import { Component, DoCheck, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  helperTextVariant: 'success' | 'error' = 'error';
  emailFocuser = { shouldFocus: true };

  onSubmit(form: NgForm) {
    form.reset();
    this.emailFocuser = { shouldFocus: true };
  }
}
