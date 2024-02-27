import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChildren,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { AccordionTabComponent } from './accordion-tab/accordion-tab.component';
import { triggerCycle } from 'src/app/utlities/tick';
import {
  PropertyNamesAsStrings,
  getKeysAsValues,
} from 'src/app/models/types/getFields';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent
  implements AfterContentChecked, AfterContentInit, OnChanges, DoCheck
{
  //This allows us to use typed values for SimpleChanges in ngOnChanges
  private fields;
  @Input() multiple = true;
  // Using accordionState object ensures updateShowAllTabs only runs if it was the last user action on the accordion.
  // The problem with using a boolean such as shouldShowAllTabs is that the parent is telling us to run this method via changing an input prop.
  // Imagine the user clicks "show all tabs", and then subsequently hides a tab. When the user hides a tab, ngOnChanges will run
  // and updateShowAllTabs should not be run because the user just requested a tab to be hidden.
  // If we used a boolean, updateShowAllTabs would run.
  @Input() accordionState = {
    showAllTabs: false,
  };

  //Use this to get the isActive status of the accordion tabs
  @ContentChildren(AccordionTabComponent)
  private accordionTabsCC!: QueryList<AccordionTabComponent>;

  private activeTabId: string | 'NO_ACTIVE_TAB' = 'NO_ACTIVE_TAB';

  constructor() {
    this.fields = getKeysAsValues(this) as PropertyNamesAsStrings<typeof this>;
  }

  ngDoCheck(): void {
    if (this.accordionTabsCC && !this.multiple) {
      this.ensureOnlyOneTabIsActive();
    }
  }

  ngAfterContentInit(): void {
    triggerCycle(this.updateShowAllTabs.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    //As far as I understand, we can act on the content children here because we are telling the contentChildren what to do from a parent.
    //If a parent were responding to changes in a content child (e.g. user form input), then we would need to use AfterContentChecked.
    //Saves a render compared to using AfterContentChecked.
    if (
      this.accordionTabsCC &&
      changes[this.fields.accordionState].currentValue !==
        changes[this.fields.accordionState].previousValue
    ) {
      this.updateShowAllTabs();
    }
  }

  ngAfterContentChecked() {
    // Can't run it here due to ExpressionChangedAfterItsHasBeenChecked error
    // if (!this.multiple) {
    //   this.ensureOnlyOneTabIsActive();
    // }
    // Can do this here instead of in ngOnChanges, but in this case Angular conducts an extra change detection check.
    // if (this.accordionState !== this.previousAccordionState) {
    //   triggerCycle(this.updateShowAllTabs.bind(this));
    //   this.previousAccordionState = this.accordionState;
    // }
  }

  private updateShowAllTabs() {
    for (let i = 0; i < this.accordionTabsCC.length; i++) {
      let ele = this.accordionTabsCC.get(i);
      if (ele) {
        ele.isActive = this.accordionState.showAllTabs;
      }
    }
  }

  private ensureOnlyOneTabIsActive() {
    for (let i = 0; i < this.accordionTabsCC.length; i++) {
      const ele = this.accordionTabsCC.get(i);
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
