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
    //An object is needed to ensure Angular detects the change even if showAllTabs equates to the same true or false value. This happens when a user clicks
    //showAllTabs, then closes one or more tabs manually and then clicks showAllTabs again, resulting in the value of showAllTabs being the same. I chose this approach
    //rather than using a Boolean object because "Any object, including a Boolean object whose value is false, evaluates to true when passed to a conditional
    //statement." This could lead to errors.
    showAllTabs: false,
  };

  accordionTabs: AccordionTabComponent[] = [];

  //use this to get the isActive status of the accordion tabs
  @ContentChildren(AccordionTabComponent)
  private contentChildren!: QueryList<AccordionTabComponent>;

  private previousAccordionState = {};
  private activeTabId: string | null = null; //keeps track of the activeTabId
  private tabIdToRemove: string | null = null;

  ngOnInit() {
    this.previousAccordionState = this.accordionState;
  }

  ngAfterContentInit(): void {
    this.updateShowAllTabsOnPageLoad();
    this.initAccordionTabArr();
  }

  ngAfterContentChecked() {
    this.ensureOnlyOneTabIsActive();

    if (this.accordionState !== this.previousAccordionState) {
      this.updateShowAllTabs();
      this.previousAccordionState = this.accordionState;
    }
  }

  private initAccordionTabArr() {
    for (let i = 0; i < this.contentChildren.length; i++) {
      let ele = this.contentChildren.get(i);
      if (ele) {
        this.accordionTabs.push(ele);
      }
    }
  }

  private updateShowAllTabsOnPageLoad() {
    let showAllTabs = this.accordionState.showAllTabs;
    for (let i = 0; i < this.contentChildren.length; i++) {
      let ele = this.contentChildren.get(i);
      if (ele && ele.isActive === null) {
        ele.isActive = showAllTabs;
      }
    }
  }

  private updateShowAllTabs() {
    let showAllTabs = this.accordionState.showAllTabs;
    for (let i = 0; i < this.contentChildren.length; i++) {
      let ele = this.contentChildren.get(i);
      if (ele) {
        ele.isActive = showAllTabs;
      }
    }
  }

  private ensureOnlyOneTabIsActive() {
    if (!this.multiple) {
      for (let i = 0; i < this.contentChildren.length; i++) {
        let ele = this.contentChildren.get(i);

        if (ele) {
          //no previous activeTab so just update it
          if (ele.isActive && this.activeTabId === null) {
            this.activeTabId = ele.tabId;
            //need
          } else if (
            ele.isActive &&
            this.activeTabId !== null &&
            ele.tabId !== this.activeTabId
          ) {
            //need to set it on the actual value as well
            this.tabIdToRemove = this.activeTabId;

            //update activeTabId
            this.activeTabId = ele.tabId;
            break;
          }
        }
      }

      if (this.tabIdToRemove) {
        this.contentChildren.forEach((ele) => {
          if (ele.tabId === this.tabIdToRemove) {
            ele.isActive = false;
          }
        });
        this.tabIdToRemove = null;
      }
    }
  }
}
