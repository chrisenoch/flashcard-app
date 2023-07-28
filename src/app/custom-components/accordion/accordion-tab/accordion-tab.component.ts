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
export class AccordionTabComponent implements OnChanges {
  @Input() tabId = ''; //make it so shows error if not provided
  @Input() isActive: boolean | null = null;

  ngOnInit(changes: SimpleChanges): void {
    console.log(
      'ngOnInit in accordion tab Value of isActive is ' + this.isActive
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
      'ngOnChanges in accordion tab Value of isActive is ' + this.isActive
    );
  }

  toggleTab() {
    console.log('in toggleTab in accordionTab');
    this.isActive = !this.isActive;
  }
}
