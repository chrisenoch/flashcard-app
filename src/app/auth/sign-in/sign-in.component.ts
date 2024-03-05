import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ButtonFunctions } from 'src/app/custom-components/button/button-functions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  helperTextVariant: 'success' | 'error' = 'error';
  emailFocuser = { shouldFocus: true };
  modifiedButtonTest = new ButtonFunctions();
  newPrimary = new Set([
    'bg-blue-700',
    'data-[disabled=false]:hover:bg-blue-800',
    'text-orange-200',
    'font-bold',
  ]);
  constructor() {
    this.modifiedButtonTest.container.variant.primary = this.newPrimary;
  }

  onSubmit(form: NgForm) {
    form.reset();
    this.emailFocuser = { shouldFocus: true };
  }

  rounded: 'sm' | 'full' | 'md' = 'full';
  variant: 'primary' | 'secondary' | 'primaryOutlined' | 'secondaryOutlined' =
    'primary';
}
