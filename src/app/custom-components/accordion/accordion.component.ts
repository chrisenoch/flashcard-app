import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { AccordionTabComponent } from './accordion-tab/accordion-tab.component';
import { triggerCycle } from 'src/app/utlities/tick';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent
  implements AfterContentChecked, OnInit, AfterContentInit
{
  @Input() multiple = true;
  @Input() accordionState = {
    showAllTabs: false,
  };

  //Use this to get the isActive status of the accordion tabs
  @ContentChildren(AccordionTabComponent)
  private contentChildren!: QueryList<AccordionTabComponent>;

  private previousAccordionState = {};
  private activeTabId: string | 'NO_ACTIVE_TAB' = 'NO_ACTIVE_TAB';

  ngOnInit() {
    this.previousAccordionState = this.accordionState;
  }

  ngAfterContentInit(): void {
    triggerCycle(this.updateShowAllTabs.bind(this));
  }

  ngAfterContentChecked() {
    if (!this.multiple) {
      this.ensureOnlyOneTabIsActive();
    }
    //Ensures, updateShowAllTabs only runs if it was the last user action on the accordion.
    //The problem with using a boolean such as shouldShowAllTabs is that the parent is telling us to run this method via changing an input prop.
    //Imagine the user clicks "show all tabs", and then subsequently hides a tab. When the user hides a tab, ngAfterContentChecked will run.
    //and updateShowAllTabs should not be run because the user just requested a tab to be hidden.
    //If we used a boolean, updateShowAllTabs would run.
    if (this.accordionState !== this.previousAccordionState) {
      triggerCycle(this.updateShowAllTabs.bind(this));
      this.previousAccordionState = this.accordionState;
    }
  }

  private updateShowAllTabs() {
    for (let i = 0; i < this.contentChildren.length; i++) {
      let ele = this.contentChildren.get(i);
      if (ele) {
        ele.isActive = this.accordionState.showAllTabs;
      }
    }
  }

  private ensureOnlyOneTabIsActive() {
    for (let i = 0; i < this.contentChildren.length; i++) {
      const ele = this.contentChildren.get(i);
      if (ele) {
        if (ele.isActive && this.activeTabId === 'NO_ACTIVE_TAB') {
          //no previous activeTab so just update it
          this.activeTabId = ele.tabId;
        } else if (ele.isActive && ele.tabId !== this.activeTabId) {
          ele.isActive = false;
          this.activeTabId = ele.tabId;
          break;
        }
      }
    }
  }
}
