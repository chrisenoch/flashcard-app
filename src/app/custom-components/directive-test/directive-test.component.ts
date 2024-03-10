import { Component, Input, OnInit } from '@angular/core';
import {
  addElementControlsSubscriptions,
  closeElementFromControl,
  showElementFromControl,
} from '../element-controls';
import { ElementControlsService } from '../element-controls.service';
import { Subscription } from 'rxjs';
import { controlledTimer } from 'src/app/models/interfaces/controlledTimer';

@Component({
  selector: 'app-directive-test',
  templateUrl: './directive-test.component.html',
  styleUrls: ['./directive-test.component.scss'],
})
export class DirectiveTestComponent implements OnInit {
  visibility: 'hidden' | 'visible' = 'visible'; //change to hidden if use timers
  display: 'inline-block' | 'none' = 'inline-block';
  subscriptions: Subscription[] = [];
  showOnInitDelayTimer: controlledTimer | undefined;
  hideOnInitDelayTimer: controlledTimer | undefined;
  hideDelayTimer: controlledTimer | undefined;
  showDelayTimer: controlledTimer | undefined;
  isShowing = false;
  @Input() elementId: string | undefined;
  @Input() elementGroupId: string | undefined;
  @Input('show') keepShowing = false;

  constructor(private elementControlsService: ElementControlsService) {}
  ngOnInit(): void {
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
}
