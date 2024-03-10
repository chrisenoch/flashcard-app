import { Component } from '@angular/core';

@Component({
  selector: 'app-directives',
  templateUrl: './directives.component.html',
  styleUrls: ['./directives.component.scss'],
})
export class DirectivesComponent {
  currentShowControl: 'PAUSE' | 'CANCEL' | 'RESUME' | undefined = undefined;
  currentHideControl: 'PAUSE' | 'CANCEL' | 'RESUME' | undefined = undefined;
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
