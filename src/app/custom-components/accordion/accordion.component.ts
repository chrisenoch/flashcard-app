import {
  AfterContentChecked,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';
import { AccordionTabComponent } from './accordion-tab/accordion-tab.component';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements AfterContentChecked {
  @Input() multiple = true;
  //tabIds map could be useful for easily deciding how to style the tabs
  tabIds: Map<string, boolean> = new Map(); //To do: change boolean type to object later
  activeTabId: string | null = null; //keeps track of the activeTabId
  tabIdToRemove: string | null = null;

  //use this to get the isActive status of the accordion tabs
  @ContentChildren(AccordionTabComponent)
  contentChildren!: QueryList<AccordionTabComponent>;

  ngAfterContentChecked() {
    this.ensureOnlyOneTabIsActive();
  }

  private ensureOnlyOneTabIsActive() {
    if (!this.multiple) {
      for (let i = 0; i < this.contentChildren.length; i++) {
        let ele = this.contentChildren.get(i);

        if (ele) {
          //update map with tabIds.
          this.tabIds.set(ele.tabId, ele.isActive);

          //no previous activeTab so just update it
          if (ele.isActive && this.activeTabId === null) {
            this.activeTabId = ele.tabId;
            //need
          } else if (
            ele.isActive &&
            this.activeTabId !== null &&
            ele.tabId !== this.activeTabId
          ) {
            //set isActive on other tabId to false
            this.tabIds.set(this.activeTabId, false);

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

      console.log(this.tabIds);
    }
  }
}
