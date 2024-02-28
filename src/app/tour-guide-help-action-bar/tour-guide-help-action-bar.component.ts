import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tour-guide-help-action-bar',
  templateUrl: './tour-guide-help-action-bar.component.html',
  styleUrls: ['./tour-guide-help-action-bar.component.scss'],
})
export class TourGuideHelpActionBarComponent {
  @Input() elementId!: string;
  @Input() elementGroupId: string | undefined;

  @Output() updateToggleTooltips = new EventEmitter();

  onToggleTooltips() {
    this.updateToggleTooltips.emit();
  }

  ngOnInit(): void {
    if (!this.elementId) {
      throw Error('You must set the elementId attribute');
    }
  }
}
