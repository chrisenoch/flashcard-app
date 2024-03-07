import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button.component';
import { ButtonChildService } from './button-child.service';
import { ButtonService } from '../button.service';

@Component({
  selector: 'app-button-child',
  templateUrl: '../button.component.html', //We change the template to point to the parent template.
  styleUrls: ['./button-child.component.scss'],
})
export class ButtonChildComponent extends ButtonComponent {
  constructor(protected override buttonService: ButtonChildService) {
    //super(new ButtonChildService());
    super(buttonService);
  }

  override initButton() {
    return this.buttonService.getChildButtonFunctions('buttonFunctionsChild');
  }
}
