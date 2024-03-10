import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  addElementControlsSubscriptions,
  closeElementFromControl,
  showElementFromControl,
} from '../element-controls';
import { ElementControlsService } from '../element-controls.service';
import { Subscription } from 'rxjs';
import { controlledTimer } from 'src/app/models/interfaces/controlledTimer';
import { initDelayTimers } from '../element-visibility';

@Component({
  selector: 'app-directive-test',
  templateUrl: './directive-test.component.html',
  styleUrls: ['./directive-test.component.scss'],
})
export class DirectiveTestComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  visibility: 'hidden' | 'visible' = 'hidden'; //change to hidden if use timers
  display: 'inline-block' | 'none' = 'inline-block';
  subscriptions: Subscription[] = [];
  // showOnInitDelayTimer: controlledTimer | undefined;
  // hideOnInitDelayTimer: controlledTimer | undefined;
  @Input() showOnInitDelay = 0;
  @Input() hideOnInitDelay = 0;
  hideDelayTimer: controlledTimer | undefined;
  showDelayTimer: controlledTimer | undefined;
  isShowing = false;
  @Input() elementId: string | undefined;
  @Input() elementGroupId: string | undefined;
  @Input('show') keepShowing = true;

  constructor(
    private elementControlsService: ElementControlsService,
    readonly ngZone: NgZone
  ) {}
  ngAfterViewInit(): void {
    initDelayTimers(this);
  }
  ngOnInit(): void {
    if (this.showOnInitDelay > 0 || this.hideOnInitDelay > 0) {
      this.keepShowing = true;
    }

    this.subscriptions.push(
      this.elementControlsService.closeAll$.subscribe((e) => {
        closeElementFromControl(this);
      })
    );

    this.subscriptions.push(
      this.elementControlsService.close$.subscribe((elementInfo) => {
        if (this.elementId === elementInfo?.elementId) {
          closeElementFromControl(this);
        }
      })
    );

    this.subscriptions.push(
      this.elementControlsService.closeAllOthers$.subscribe((elementInfo) => {
        if (this.elementId !== elementInfo?.elementId) {
          closeElementFromControl(this);
        }
      })
    );

    if (this.elementGroupId !== undefined) {
      this.subscriptions.push(
        this.elementControlsService.closeAllInGroup$.subscribe(
          (elementInfo) => {
            if (this.elementGroupId === elementInfo?.elementGroupId) {
              closeElementFromControl(this);
            }
          }
        )
      );
    }

    if (this.elementGroupId !== undefined) {
      this.subscriptions.push(
        this.elementControlsService.closeAllOthersInGroup$.subscribe(
          (elementInfo) => {
            if (
              this.elementId !== elementInfo?.elementId &&
              this.elementGroupId === elementInfo?.elementGroupId
            ) {
              closeElementFromControl(this);
            }
          }
        )
      );
    }

    this.subscriptions.push(
      this.elementControlsService.show$.subscribe((elementInfo) => {
        if (this.elementId === elementInfo?.elementId) {
          showElementFromControl(this);
        }
      })
    );

    this.subscriptions.push(
      this.elementControlsService.showAll$.subscribe((elementInfo) => {
        showElementFromControl(this);
      })
    );

    this.subscriptions.push(
      this.elementControlsService.showAllOthersInGroup$.subscribe(
        (elementInfo) => {
          if (this.elementGroupId === elementInfo?.elementGroupId) {
            showElementFromControl(this);
          }
        }
      )
    );

    this.subscriptions.push(
      this.elementControlsService.closeById$.subscribe((elementInfo) => {
        console.log('elementInfo closeById');
        console.log(elementInfo);
        if (this.elementId === elementInfo?.elementId) {
          closeElementFromControl(this);
        }
      })
    );

    this.subscriptions.push(
      this.elementControlsService.showById$.subscribe((elementInfo) => {
        console.log('elementInfo showById');
        if (this.elementId === elementInfo?.elementId) {
          showElementFromControl(this);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
