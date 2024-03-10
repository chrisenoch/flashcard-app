import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import {
  closeElementFromControl,
  showElementFromControl,
} from '../element-controls';
import { ElementControlsService } from '../element-controls.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-directive-test',
  templateUrl: './directive-test.component.html',
  styleUrls: ['./directive-test.component.scss'],
})
export class DirectiveTestComponent implements OnInit, OnDestroy {
  display: 'inline-block' | 'none' = 'inline-block';
  subscriptions: Subscription[] = [];
  @Input() elementId: string | undefined;
  @Input() elementGroupId: string | undefined;

  constructor(private elementControlsService: ElementControlsService) {}

  ngOnInit(): void {
    // this.subscriptions.push(
    //   this.elementControlsService.close$.subscribe((elementInfo) => {
    //     if (this.elementId === elementInfo?.elementId) {
    //       closeElementFromControl(this);
    //     }
    //   })
    // );
    // if (this.elementGroupId !== undefined) {
    //   this.subscriptions.push(
    //     this.elementControlsService.closeAllInGroup$.subscribe(
    //       (elementInfo) => {
    //         if (this.elementGroupId === elementInfo?.elementGroupId) {
    //           closeElementFromControl(this);
    //         }
    //       }
    //     )
    //   );
    // }
    // if (this.elementGroupId !== undefined) {
    //   this.subscriptions.push(
    //     this.elementControlsService.closeAllOthersInGroup$.subscribe(
    //       (elementInfo) => {
    //         if (
    //           this.elementId !== elementInfo?.elementId &&
    //           this.elementGroupId === elementInfo?.elementGroupId
    //         ) {
    //           closeElementFromControl(this);
    //         }
    //       }
    //     )
    //   );
    // }
    // this.subscriptions.push(
    //   this.elementControlsService.show$.subscribe((elementInfo) => {
    //     if (this.elementId === elementInfo?.elementId) {
    //       showElementFromControl(this);
    //     }
    //   })
    // );
    // this.subscriptions.push(
    //   this.elementControlsService.showAllOthersInGroup$.subscribe(
    //     (elementInfo) => {
    //       if (this.elementGroupId === elementInfo?.elementGroupId) {
    //         showElementFromControl(this);
    //       }
    //     }
    //   )
    // );
    // this.subscriptions.push(
    //   this.elementControlsService.closeById$.subscribe((elementInfo) => {
    //     if (this.elementId === elementInfo?.elementId) {
    //       closeElementFromControl(this);
    //     }
    //   })
    // );
    // this.subscriptions.push(
    //   this.elementControlsService.showById$.subscribe((elementInfo) => {
    //     if (this.elementId === elementInfo?.elementId) {
    //       showElementFromControl(this);
    //     }
    //   })
    // );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
