import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Arrows } from 'src/app/custom-components/toast/models/arrows';
import { Position } from 'src/app/custom-components/toast/models/position';

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

  //to test custom toast component
  nextElements: {
    id: string;
    position: Position;
    effectivePosition: 'absolute' | 'fixed';
    arrows?: Arrows;
  }[] = [
    { id: 'toast-1-a', position: 'LEFT', effectivePosition: 'absolute' },
    { id: 'toast-1-b', position: 'RIGHT', effectivePosition: 'fixed' },
    { id: 'toast-1-c', position: 'RIGHT', effectivePosition: 'absolute' },

    // { id: 'toast-destination-3', position: 'TOP', arrows: ['TOP', 'BOTTOM'] },
  ];

  toastDestinations!: [
    {
      id: string;
      element: Element;
      position: Position;
    }
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
