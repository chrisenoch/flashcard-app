import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { AccordionTabComponent } from './accordion-tab/accordion-tab.component';
import { fromEvent } from 'rxjs';

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
  }

  ngAfterContentChecked() {
    this.ensureOnlyOneTabIsActive();

    if (this.accordionState !== this.previousAccordionState) {
      this.updateShowAllTabs();
      this.previousAccordionState = this.accordionState;
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
        console.log('in remove if');
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
