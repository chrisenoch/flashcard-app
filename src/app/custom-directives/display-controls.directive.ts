import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ElementControlsService } from '../custom-components/element-controls.service';

@Directive({
  selector: '[appDisplayControls]',
})
export class DisplayControlsDirective {
  subscriptions: Subscription[] = [];
  @Input() elementId: string | undefined;
  @Input() elementGroupId: string | undefined;
  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private elementControlsService: ElementControlsService) {}

  handleIsOpen(isOpen: boolean) {
    console.log('in handleIsOpen in appDisplayControls');
    this.isOpen.emit(isOpen);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.elementControlsService.close$.subscribe((elementInfo) => {
        if (this.elementId === elementInfo?.elementId) {
          this.handleIsOpen(false);
        }
      })
    );

    if (this.elementGroupId !== undefined) {
      this.subscriptions.push(
        this.elementControlsService.closeAllInGroup$.subscribe(
          (elementInfo) => {
            if (this.elementGroupId === elementInfo?.elementGroupId) {
              this.handleIsOpen(false);
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
              this.handleIsOpen(false);
            }
          }
        )
      );
    }

    this.subscriptions.push(
      this.elementControlsService.show$.subscribe((elementInfo) => {
        if (this.elementId === elementInfo?.elementId) {
          this.handleIsOpen(true);
        }
      })
    );

    this.subscriptions.push(
      this.elementControlsService.showAllOthersInGroup$.subscribe(
        (elementInfo) => {
          if (this.elementGroupId === elementInfo?.elementGroupId) {
            this.handleIsOpen(true);
          }
        }
      )
    );

    this.subscriptions.push(
      this.elementControlsService.closeById$.subscribe((elementInfo) => {
        if (this.elementId === elementInfo?.elementId) {
          this.handleIsOpen(false);
        }
      })
    );

    this.subscriptions.push(
      this.elementControlsService.showById$.subscribe((elementInfo) => {
        if (this.elementId === elementInfo?.elementId) {
          this.handleIsOpen(true);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
