import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-accordion-tab',
  templateUrl: './accordion-tab.component.html',
  styleUrls: ['./accordion-tab.component.scss'],
})
export class AccordionTabComponent {
  @Input() tabId = ''; //make it so shows error if not provided
  @Input() isActive = false;

  toggleTab() {
    console.log('in toggleTab in accordionTab');
    this.isActive = !this.isActive;
  }
}
