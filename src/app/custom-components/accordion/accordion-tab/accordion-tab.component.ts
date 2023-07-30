import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-accordion-tab',
  templateUrl: './accordion-tab.component.html',
  styleUrls: ['./accordion-tab.component.scss'],
})
export class AccordionTabComponent {
  @Input() tabId = ''; //make it so shows error if not provided
  @Input() isActive: boolean | null = null;

  ngOnInit() {
    if (!this.tabId) {
      throw Error(
        'tabId attribute not set on accordion tab component. tabId must be of type string and must be one character or more.'
      );
    }
  }

  toggleTab() {
    this.isActive = !this.isActive;
  }
}
