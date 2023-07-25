import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-accordion-tab',
  templateUrl: './accordion-tab.component.html',
  styleUrls: ['./accordion-tab.component.scss'],
})
export class AccordionTabComponent {
  @Input() tabId = ''; //make it so shjows error if not provided
  //get map of active states from parent component
  @Input() tabIds: Map<string, boolean> = new Map();

  //set isActive state here depending on value of map and tabId
  //isActive = this.tabIds.get(this.tabId); // this is derived from map, which is received from parent component

  isActive = false;

  // ngOnInit() {
  // }

  @Output() updateIsActive = new EventEmitter<{
    tabId: string;
    isActive: boolean;
  }>();

  toggleTab() {
    console.log('in toggle tab11111');
    this.updateIsActive.emit({ tabId: this.tabId, isActive: !this.isActive });
  }
}
