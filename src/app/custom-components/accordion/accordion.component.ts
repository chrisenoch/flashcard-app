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
    showAllTabs: false,
  };

  accordionTabs: AccordionTabComponent[] = [];

  //use this to get the isActive status of the accordion tabs
  @ContentChildren(AccordionTabComponent)
  private contentChildren!: QueryList<AccordionTabComponent>;

  private previousAccordionState = {};
  private activeTabId: string | null = null; //keeps track of the activeTabId

  ngOnInit() {
    this.previousAccordionState = this.accordionState;
  }

  ngAfterContentInit(): void {
    this.updateShowAllTabsOnPageLoad();
    this.initAccordionTabArr();
  }

  ngAfterContentChecked() {
    if (!this.multiple) {
      this.ensureOnlyOneTabIsActive();
    }

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
          ele.isActive = false;
          this.activeTabId = ele.tabId;
          break;
        }
      }
    }
  }
}
