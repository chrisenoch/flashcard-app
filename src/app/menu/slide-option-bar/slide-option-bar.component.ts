import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slide-option-bar',
  templateUrl: './slide-option-bar.component.html',
  styleUrls: ['./slide-option-bar.component.scss'],
})
export class SlideOptionBarComponent {
  @Output() updateShowContentAfterWordVisited = new EventEmitter();
  @Output() updateShowTranslation = new EventEmitter();

  onShowContentAfterWordVisited() {
    this.updateShowContentAfterWordVisited.emit();
    console.log('just emitted');
  }

  onShowTranslation() {
    this.updateShowTranslation.emit();
    console.log('just emitted');
  }
}
