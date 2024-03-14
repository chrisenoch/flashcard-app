import { Component, Input, OnInit } from '@angular/core';
import { ButtonComponent } from '../button.component';
import { ButtonChildrenService } from './button-child.service';
import { ButtonService } from '../button.service';
import { GlobalComponentFunctionsService } from '../global-component-functions.service';

@Component({
  selector: 'app-button-child',
  templateUrl: '../button.component.html', //We change the template to point to the parent template.
  styleUrls: ['./button-child.component.scss'],
})
export class ButtonChildComponent extends ButtonComponent {
  constructor(
    protected override buttonService: ButtonChildrenService,
    protected override globalComponentFunctions: GlobalComponentFunctionsService
  ) {
    super(buttonService, globalComponentFunctions);
  }
  override initButton() {
    //this.buttonService below refers to ButtonChildrenService (see the constructor)
    return this.buttonService.getChildButtonFunctions('buttonFunctionsChild');
  }

  @Input() transform: 'upperCase' | 'lowerCase' | 'capitalize' | 'normalCase' =
    'normalCase';

  //init extra prop that does not exist on parent ButtonComponent
  override extraCSSInputArgs() {
    return [
      {
        inputPropName: 'transform',
        inputPropValue: this.transform,
      },
    ];
  }

  //Or override the entire array.
  // protected override getTransformedCSSInputArgs() {
  //   return [
  //     {
  //       inputPropName: this.fields.rounded,
  //       inputPropValue: this.rounded,
  //     },
  //     {
  //       inputPropName: this.fields.size,
  //       inputPropValue: this.size,
  //     },

  //     {
  //       inputPropName: this.fields.variant,
  //       inputPropValue: this.variant,
  //     },

  //     {
  //       inputPropName: this.fields.disabled,
  //       inputPropValue: this.disabled,
  //     },
  //     {
  //       inputPropName: this.fields.default,
  //       inputPropValue: this.default,
  //     },
  //     {
  //       inputPropName: 'transform',
  //       inputPropValue: this.transform,
  //     },
  //   ];
  // }
}
