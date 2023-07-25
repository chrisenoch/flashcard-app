import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
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
  tabIds: Map<string, boolean> = new Map(); //To do: change boolean type to object later

  // Query for a VIEW child of type `ChildViewComponent`
  @ContentChildren(AccordionTabComponent)
  contentChildren!: QueryList<AccordionTabComponent>;

  ngAfterContentChecked() {
    const newTabIds: Map<string, boolean> = new Map();

    this.contentChildren.forEach((ele) => {
      newTabIds.set(ele.tabId, ele.isActive);
      // console.log(ele.isActive);
      // console.log(ele.tabId);
    });

    this.tabIds = newTabIds;
    console.log(this.tabIds);
  }
}
