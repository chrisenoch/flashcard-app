import { Component } from '@angular/core';

@Component({
  selector: 'app-tour-guide-demo',
  templateUrl: './tour-guide-demo.component.html',
  styleUrls: ['./tour-guide-demo.component.scss'],
})
export class TourGuideDemoComponent {
  currentShowControl: any = null;
  currentHideControl: any = null;
  updateShowReady() {
    console.log('updateShowReady called in tour-guide demo component');
  }
  updateHideReady() {
    console.log('updateHideReady called in tour-guide demo component');
  }

  controlShowOnInit(control: 'PAUSE' | 'CANCEL' | 'RESUME') {
    if (control === 'PAUSE') {
      this.currentShowControl = 'PAUSE';
    }
    if (control === 'RESUME') {
      this.currentShowControl = 'RESUME';
    }
    if (control === 'CANCEL') {
      this.currentShowControl = 'CANCEL';
    }
  }

  controlHideOnInit(control: 'PAUSE' | 'CANCEL' | 'RESUME') {
    if (control === 'PAUSE') {
      this.currentHideControl = 'PAUSE';
    }
    if (control === 'RESUME') {
      this.currentHideControl = 'RESUME';
    }
    if (control === 'CANCEL') {
      this.currentHideControl = 'CANCEL';
    }
  }
}
