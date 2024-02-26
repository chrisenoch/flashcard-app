import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Arrows } from 'src/app/custom-components/models/arrows';
import { Position } from 'src/app/custom-components/models/position';

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

  //to test
  onTourGuideTransitionEnd = {
    callback: () => console.log('transition ended'),
    propertiesToFireOn: ['top'],
  };

  //to test custom tour-guide component
  nextElements: {
    id: string;
    position: Position;
    effectivePosition: 'absolute' | 'fixed';
    arrows?: Arrows;
  }[] = [
    { id: 'tour-guide-1-a', position: 'LEFT', effectivePosition: 'absolute' },
    { id: 'tour-guide-1-e', position: 'RIGHT', effectivePosition: 'fixed' },
    { id: 'tour-guide-1-c', position: 'RIGHT', effectivePosition: 'absolute' },
  ];

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
