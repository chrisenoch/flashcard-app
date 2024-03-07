import { Component, DoCheck, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ButtonChildService } from 'src/app/custom-components/button/button-child/button-child.service';
import { ButtonFunctions } from 'src/app/custom-components/button/button-functions';
import { ButtonFunctionsChild } from 'src/app/custom-components/button/button-functions-child';
import { ButtonService } from 'src/app/custom-components/button/button.service';
import { GlobalComponentFunctionsService } from 'src/app/custom-components/button/global-component-functions.service';

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
  modifiedButtonTestTwo = new ButtonFunctions();
  newPrimaryTwo = new Set([
    'bg-green-700',
    'data-[disabled=false]:hover:bg-green-800',
    'text-gray-900',
    'font-light',
  ]);

  buttonChild = new ButtonFunctionsChild();

  constructor(
    private buttonService: ButtonService,
    private buttonChildService: ButtonChildService,
    private globalComponentFunctionsService: GlobalComponentFunctionsService
  ) {
    this.modifiedButtonTest.container.variant.primary = this.newPrimary;
    // this.modifiedButtonTest.mode = 'dark';
    this.modifiedButtonTestTwo.container.variant.primary = this.newPrimaryTwo;
  }

  onSubmit(form: NgForm) {
    form.reset();
    this.emailFocuser = { shouldFocus: true };
  }

  private updatModifiedButtonTest(mode: 'dark' | 'light') {
    const newModifiedButtonTest = new ButtonFunctions();
    newModifiedButtonTest.container.variant.primary = this.newPrimary;
    this.modifiedButtonTest = newModifiedButtonTest;
    this.modifiedButtonTest.mode = mode;
  }

  private updateChildMode(mode: 'dark' | 'light') {
    const newButtonChild = new ButtonFunctionsChild();
    newButtonChild.container.variant.primary = this.newPrimary;
    this.buttonChild = newButtonChild;
    this.buttonChild.mode = mode;
  }

  toggleNestedModeChild() {
    if (this.buttonChild.mode === 'dark') {
      //Object reference needs to change or changes not picked up. Could perhaps define an id and check for this in ngChanges. This way, easier to instantiate changes as we couldn't have to create the class again with all the modifications.
      this.updateChildMode('light');
    } else {
      this.updateChildMode('dark');
    }
  }

  toggleNestedMode() {
    if (this.modifiedButtonTest.mode === 'dark') {
      //Object reference needs to change or changes not picked up. Could perhaps define an id and check for this in ngChanges. This way, easier to instantiate changes as we couldn't have to create the class again with all the modifications.
      this.updatModifiedButtonTest('light');
    } else {
      this.updatModifiedButtonTest('dark');
    }
  }

  toggleGlobalMode() {
    if (this.modifiedButtonTest.mode === 'dark') {
      this.globalComponentFunctionsService.updateMode('light');
      // this.buttonService.updateMode('light');
      // this.buttonChildService.updateMode('light');
    } else {
      // this.buttonService.updateMode('dark');
      // this.buttonChildService.updateMode('dark');
      this.globalComponentFunctionsService.updateMode('dark');
    }
  }

  //test
  modBtnSXProps: any = {
    container: {
      add: [
        'w-full',
        'bg-gray-700',
        'data-[disabled=false]:hover:bg-gray-800',
        'text-white',
      ],
    },
  };
  updateModifiedThemeButton() {
    this.modBtnSXProps = {
      container: {
        remove: [
          'w-full',
          'bg-gray-700',
          'data-[disabled=false]:hover:bg-gray-800',
          'text-white',
        ],
      },
    };
  }

  size: 'lg' | 'sm' = 'lg';
  updateSizeSubmitButton() {
    this.size = 'sm';
  }

  rounded: 'sm' | 'full' | 'md' = 'full';
  variant: 'primary' | 'secondary' | 'primaryOutlined' | 'secondaryOutlined' =
    'primary';
}
