import { Component, OnInit, SimpleChanges } from '@angular/core';
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

  testVariant: 'success' | 'error' = 'success';
  updateTestVariant() {
    console.log('in updateTestVariant');
    if (this.testVariant === 'success') {
      this.testVariant = 'error';
    } else {
      this.testVariant = 'success';
    }
  }

  ngOnInit(): void {
    console.log('in SignIn ngonInit');
  }
  ngDoCheck(): void {
    console.log('in SignIn docheck');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('in SignIn onChanges');
  }
}
