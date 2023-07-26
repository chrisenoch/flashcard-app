import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-accordion-tab',
  templateUrl: './accordion-tab.component.html',
  styleUrls: ['./accordion-tab.component.scss'],
})
export class AccordionTabComponent {
  @Input() tabId = ''; //make it so shjows error if not provided
  @Input() isActive = false;

  toggleTab() {
    this.isActive = !this.isActive;
    console.log('in toggle in accordion-tab component');
  }
}
