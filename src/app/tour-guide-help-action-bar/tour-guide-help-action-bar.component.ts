import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ElementControlsService } from '../custom-components/element-controls.service';

@Component({
  selector: 'app-tour-guide-help-action-bar',
  templateUrl: './tour-guide-help-action-bar.component.html',
  styleUrls: ['./tour-guide-help-action-bar.component.scss'],
})
export class TourGuideHelpActionBarComponent implements OnInit, OnDestroy {
  @Input() elementId!: string;
  @Input() elementGroupId: string | undefined;
  @Input() showTooltipsOnUserAction: boolean | undefined;
  @Output() updateToggleTooltips = new EventEmitter();
  subscriptions: Subscription[] = [];

  onToggleTooltips() {
    this.updateToggleTooltips.emit();
  }

  constructor(readonly elementControlsService: ElementControlsService) {}

  ngOnInit(): void {
    if (!this.elementId) {
      throw Error('You must set the elementId attribute');
    }

    // Any component can listen to the events fired on the directives:
    // this.subscriptions.push(
    //   this.elementControlsService.showAll$.subscribe((elementInfo) => { //showAll is an event fired from a directive.
    //     console.log('in subscriber in tour-guide-help action bar SHOW ALL');
    //   })
    // );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
