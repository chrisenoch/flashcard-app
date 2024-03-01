import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  onSubmit(form: NgForm) {
    console.log('in submit button');
    console.log(form);
  }

  testSet = new Set(['ml-4', 'mb-2', 'text-xs', 'text-green-600']);
}
