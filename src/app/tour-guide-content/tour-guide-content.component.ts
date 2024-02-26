import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tour-guide-content',
  templateUrl: './tour-guide-content.component.html',
  styleUrls: ['./tour-guide-content.component.scss'],
})
export class TourGuideContentComponent implements OnInit {
  @Input() elementId!: string;
  @Input() elementGroupId: string | undefined;

  ngOnInit(): void {
    if (!this.elementId) {
      throw Error('You must set the elementId attribute');
    }
  }
}
