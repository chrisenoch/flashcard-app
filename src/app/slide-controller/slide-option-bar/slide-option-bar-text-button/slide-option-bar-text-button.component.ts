import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-option-bar-text-button',
  templateUrl: './slide-option-bar-text-button.component.html',
  styleUrls: ['./slide-option-bar-text-button.component.scss'],
})
export class SlideOptionBarTextButtonComponent {
  @Input() buttonText = '';
}
