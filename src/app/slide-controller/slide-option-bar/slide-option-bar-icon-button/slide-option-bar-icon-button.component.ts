import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-option-bar-icon-button',
  templateUrl: './slide-option-bar-icon-button.component.html',
  styleUrls: ['./slide-option-bar-icon-button.component.scss'],
})
export class SlideOptionBarIconButtonComponent {
  @Input() iconClasses = '';
}
