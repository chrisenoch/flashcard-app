import { Component } from '@angular/core';

@Component({
  selector: 'app-tour-guide-demo',
  templateUrl: './tour-guide-demo.component.html',
  styleUrls: ['./tour-guide-demo.component.scss'],
})
export class TourGuideDemoComponent {
  updateShowReady() {
    console.log('updateShowReady called in tour-guide demo component');
  }

  updateHideReady() {
    console.log('updateHideReady called in tour-guide demo component');
  }
}
