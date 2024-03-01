import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  helperTextVariant: 'success' | 'error' = 'error';

  onSubmit(form: NgForm) {
    console.log('in submit button');
    console.log(form);
    if (this.helperTextVariant === 'error') {
      this.helperTextVariant = 'success';
    } else {
      this.helperTextVariant = 'error';
    }
  }
}
