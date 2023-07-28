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
  // @Input() isActiveNum = 'THREE';

  //need isActive variable but when accordionTabState enters, isActive is changed.
  //showAllTabs
  //ngonchanges, update isactive variable here. I think it will update too often. So can compare if new object samme as previous object. If it is the same, don't update.

  @Input() accordionTabState = { isActive: false };
  isActive = false;

  ngOnChanges() {
    this.isActive = this.accordionTabState.isActive;

    console.log('in accordion tab in ngOnChanges - tabID ' + this.tabId);
    console.log(
      'in accordion tab in ngOnChanges - accordionTabState ' +
        this.accordionTabState.isActive +
        ' isActive ' +
        this.isActive
    );
    // console.log('*** in accordion tab - this.isActiveNum ' + this.isActiveNum);
    // this.isActive =
    //   this.isActiveNum === 'ONE' || this.isActiveNum === 'TWO' ? true : false;
  }

  toggleTab() {
    console.log(
      'in toggleTab in accordion tab B4 swap ' +
        this.accordionTabState.isActive +
        ' ' +
        this.accordionTabState
    );
    this.isActive = !this.isActive;
    console.log(
      'in toggleTab in accordion tab AFTER swap ' +
        this.accordionTabState.isActive
    );
  }
}
