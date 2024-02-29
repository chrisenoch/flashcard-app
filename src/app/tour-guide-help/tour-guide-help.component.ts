import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-tour-guide-help',
  templateUrl: './tour-guide-help.component.html',
  styleUrls: ['./tour-guide-help.component.scss'],
})
export class TourGuideHelpComponent implements OnInit {
  @Input() elementId!: string;
  @Input() elementGroupId: string | undefined;
  @Input() showCloseIcon: boolean = false;

  ngOnInit(): void {
    if (!this.elementId) {
      throw Error('You must set the elementId attribute');
    }
  }
}
