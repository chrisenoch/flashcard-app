import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slide-option-bar',
  templateUrl: './slide-option-bar.component.html',
  styleUrls: ['./slide-option-bar.component.scss'],
})
export class SlideOptionBarComponent {
  @Output() updateShowContentAfterWordVisited = new EventEmitter();
  @Output() updateShowTranslation = new EventEmitter();
  @Output() updateShowExplanation = new EventEmitter();
  @Output() updateSidebarOnRight = new EventEmitter();
  @Output() updateSlideNavbarPos = new EventEmitter();
  @Input() sidebarsOnRight = false;
  @Input() slideNavbarPos: 'LEFT' | 'MIDDLE' | 'RIGHT' = 'MIDDLE';

  onShowContentAfterWordVisited() {
    this.updateShowContentAfterWordVisited.emit();
  }

  onShowTranslation() {
    this.updateShowTranslation.emit();
  }

  onShowExplanation() {
    this.updateShowExplanation.emit();
  }

  onMoveSidebar() {
    this.updateSidebarOnRight.emit();
  }

  onChangeSlideNavbarPos() {
    this.updateSlideNavbarPos.emit();
    console.log('just emitted');
  }
}
