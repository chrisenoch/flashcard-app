import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
export default class ExerciseSlideComponent {
  @Input() questions: {
    questionId: string;
    question: string;
    answer: string;
  }[] = [];
  @Input() accordionState = {
    showAllTabs: false,
  };
}
