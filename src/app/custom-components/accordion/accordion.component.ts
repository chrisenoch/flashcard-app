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
  implements OnInit, AfterContentChecked, AfterContentInit, OnChanges, DoCheck
{
  //This allows us to use typed values for SimpleChanges in ngOnChanges
  private fields;
  @Input() multiple = true;
  // Using accordionState object ensures updateShowAllTabs only runs if it was the last user action on the accordion.
  // The problem with using a boolean such as shouldShowAllTabs is that the parent is telling us to run this method via changing an input prop.
  // Imagine the user clicks "show all tabs", and then subsequently hides a tab. When the user hides a tab, ngOnChanges will run
  // and updateShowAllTabs should not be run because the user just requested a tab to be hidden.
  // If we used a boolean, updateShowAllTabs would run.
  @Input() accordionState: {
    showAllTabs: 'NOT_INITIALISED' | boolean;
  } = {
    showAllTabs: 'NOT_INITIALISED',
  };

  //Use this to get the isActive status of the accordion tabs
  @ContentChildren(AccordionTabComponent)
  private accordionTabsCC!: QueryList<AccordionTabComponent>;

  private activeTabId: string | 'NO_ACTIVE_TAB' = 'NO_ACTIVE_TAB';

  constructor() {
    this.fields = getKeysAsValues(this) as PropertyNamesAsStrings<typeof this>;
  }
  ngOnInit(): void {
    if (
      !this.multiple &&
      this.accordionState.showAllTabs !== 'NOT_INITIALISED'
    ) {
      console.error(
        'If multiple is equal to false, you should not provide a value for accordionState.showAllTabs.'
      );
    }
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
    if (this.accordionState.showAllTabs !== 'NOT_INITIALISED') {
      for (let i = 0; i < this.accordionTabsCC.length; i++) {
        let ele = this.accordionTabsCC.get(i);
        if (ele) {
          ele.isActive = this.accordionState.showAllTabs;
        }
      }
    }
  }

  private ensureOnlyOneTabIsActive() {
    //get new active tab
    for (let i = 0; i < this.accordionTabsCC.length; i++) {
      const accordionTab = this.accordionTabsCC.get(i);
      if (accordionTab) {
        if (accordionTab.isActive && this.activeTabId === 'NO_ACTIVE_TAB') {
          //no previous activeTab so just update it
          this.activeTabId = accordionTab.tabId;
        } else if (
          accordionTab.isActive &&
          accordionTab.tabId !== this.activeTabId
        ) {
          this.activeTabId = accordionTab.tabId;
          break;
        }
      }
    }

    //remove other active tabs
    for (let i = 0; i < this.accordionTabsCC.length; i++) {
      const accordionTab = this.accordionTabsCC.get(i);
      if (accordionTab && this.activeTabId !== accordionTab.tabId) {
        accordionTab.isActive = false;
      }
    }
  }
}
