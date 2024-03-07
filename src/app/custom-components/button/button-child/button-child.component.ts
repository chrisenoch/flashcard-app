import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button.component';
import { ButtonChildService } from './button-child.service';

@Component({
  selector: 'app-button-child',
  templateUrl: '../button.component.html',
  styleUrls: ['./button-child.component.scss'],
})
export class ButtonChildComponent extends ButtonComponent {
  constructor() {
    super(new ButtonChildService());
    this.defaultButtonInstance = 'buttonFunctionsChild';
  }
}
