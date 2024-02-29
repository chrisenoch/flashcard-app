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
  tourGuideArrowLeftCSSClasses =
    'absolute top-[50%] left-0 w-0 h-0 border-r-8 -mt-2 -ml-2 border-b-8 border-t-8 border-b-transparent border-t-transparent border-r-blue-100';
  tourGuideArrowRightCSSClasses =
    'absolute top-[50%] right-0 w-0 h-0 border-l-8 -mt-2 -mr-2 border-b-8 border-t-8 border-b-transparent border-t-transparent border-l-blue-100';

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
