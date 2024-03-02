import { Component, OnInit } from '@angular/core';
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
    console.log('form below');
    console.log(form);
    form.reset();
    this.emailFocuser = { shouldFocus: true };
  }
}
