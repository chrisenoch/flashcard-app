import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slide-option-bar',
  templateUrl: './slide-option-bar.component.html',
  styleUrls: ['./slide-option-bar.component.scss'],
})
export class SlideOptionBarComponent {
  @Output() updateShowContentAfterWordVisited = new EventEmitter();
  @Output() updateShowTranslation = new EventEmitter();
  @Output() updateToggleTranslation = new EventEmitter();
  @Output() updateShowExplanation = new EventEmitter();
  @Output() updateSidebarsOnRight = new EventEmitter();
  @Output() updateSlideNavbarPos = new EventEmitter();
  @Output() updateShowAllExerciseAnswers = new EventEmitter();
  @Output() updateHideAllExerciseAnswers = new EventEmitter();

  @Input() sidebarsOnRight = false;
  @Input() slideNavbarPos: 'LEFT' | 'MIDDLE' | 'RIGHT' = 'MIDDLE';
  showTooltips = true;

  updateToggleTooltips() {
    this.showTooltips = !this.showTooltips;
    console.log('inside updateToggleTooltips');
    console.log('new this.showTooltips' + this.showTooltips);
  }

  onShowContentAfterWordVisited() {
    this.updateShowContentAfterWordVisited.emit();
  }

  onShowTranslation() {
    this.updateShowTranslation.emit();
  }

  onToggleTranslation() {
    this.updateToggleTranslation.emit();
  }

  onShowAllExerciseAnswers() {
    this.updateShowAllExerciseAnswers.emit();
  }

  onHideAllExerciseAnswers() {
    this.updateHideAllExerciseAnswers.emit();
  }

  onShowExplanation() {
    this.updateShowExplanation.emit();
  }

  onMoveSidebar() {
    this.updateSidebarsOnRight.emit();
  }

  onChangeSlideNavbarPos() {
    this.updateSlideNavbarPos.emit();
  }
}
