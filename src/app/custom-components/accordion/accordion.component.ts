import {
  AfterContentChecked,
  Component,
  ContentChild,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { AccordionTabComponent } from './accordion-tab/accordion-tab.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements AfterContentChecked {
  tabIds: Map<string, boolean> = new Map(); //To do: change boolean type to object later

  //receive click event from child and then update child

  // @ViewChildren(ChildDirective) viewChildren!: QueryList<ChildDirective>;

  // Query for a VIEW child of type `ChildViewComponent`
  @ContentChildren(AccordionTabComponent)
  contentChildren!: QueryList<AccordionTabComponent>;

  ngAfterContentChecked() {
    this.contentChildren.forEach((ele) => {
      console.log(ele.isActive);
      console.log(ele.tabId);
    });
  }
}
