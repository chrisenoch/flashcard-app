import { Component, DoCheck, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ButtonFunctions } from 'src/app/custom-components/button/button-functions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements DoCheck {
  helperTextVariant: 'success' | 'error' = 'error';
  emailFocuser = { shouldFocus: true };
  modifiedButtonTest = new ButtonFunctions();
  newPrimary = new Set([
    'bg-blue-700',
    'data-[disabled=false]:hover:bg-blue-800',
    'text-orange-200',
    'font-bold',
  ]);
  modifiedButtonTestTwo = new ButtonFunctions();
  newPrimaryTwo = new Set([
    'bg-green-700',
    'data-[disabled=false]:hover:bg-green-800',
    'text-gray-900',
    'font-light',
  ]);
  //originalMode;
  constructor() {
    this.modifiedButtonTest.container.variant.primary = this.newPrimary;
    // this.modifiedButtonTest.mode = 'dark';
    //this.originalMode = 'dark';
    this.modifiedButtonTestTwo.container.variant.primary = this.newPrimaryTwo;
  }
  ngDoCheck(): void {
    // if (this.originalMode)
  }

  onSubmit(form: NgForm) {
    form.reset();
    this.emailFocuser = { shouldFocus: true };
  }

  toggleMode() {
    console.log('in toggleMode');
    console.log('this.modifiedButtonTest.mode at start');
    console.log(this.modifiedButtonTest.mode);

    //this.modifiedButtonTest.setDarkOrLight('dark');
    //this.modifiedButtonTest.mode = 'dark';
    console.log('this.modifiedButtonTest.mode  BEFORE IF ELSE');
    console.log(this.modifiedButtonTest.mode);
    if (this.modifiedButtonTest.mode === 'dark') {
      const newModifiedButtonTest = new ButtonFunctions();
      newModifiedButtonTest.container.variant.primary = this.newPrimary;
      this.modifiedButtonTest = newModifiedButtonTest;
      console.log('in if');
      this.modifiedButtonTest.setDarkOrLight('light');
    } else {
      const newModifiedButtonTest = new ButtonFunctions();
      newModifiedButtonTest.container.variant.primary = this.newPrimary;
      this.modifiedButtonTest = newModifiedButtonTest;
      console.log('in else');
      this.modifiedButtonTest.setDarkOrLight('dark');
    }

    console.log(
      'new mode in modifiedbuttontest ' + this.modifiedButtonTest.mode
    );

    //this.modifiedButtonTest.up
  }

  rounded: 'sm' | 'full' | 'md' = 'full';
  variant: 'primary' | 'secondary' | 'primaryOutlined' | 'secondaryOutlined' =
    'primary';
}
