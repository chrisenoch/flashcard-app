import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-accordion-tab',
  templateUrl: './accordion-tab.component.html',
  styleUrls: ['./accordion-tab.component.scss'],
})
export class AccordionTabComponent {
  @Input() tabId = ''; //make it so shjows error if not provided
  @Input() isActiveNum = 'THREE';
  @Input() isActive =
    this.isActiveNum === 'ONE' || this.isActiveNum === 'TWO' ? true : false;

  ngOnChanges() {
    console.log('in accordion tab in ngOnChanges - tabID ' + this.tabId);
    console.log('in accordion tab in ngOnChanges - isActive ' + this.isActive);
    console.log('*** in accordion tab - this.isActiveNum ' + this.isActiveNum);
    this.isActive =
      this.isActiveNum === 'ONE' || this.isActiveNum === 'TWO' ? true : false;
  }

  toggleTab() {
    console.log('in toggleTab in accordion tab B4 swap ' + this.isActive);
    this.isActive = !this.isActive;
    console.log('in toggleTab in accordion tab AFTER swap ' + this.isActive);
  }
}
