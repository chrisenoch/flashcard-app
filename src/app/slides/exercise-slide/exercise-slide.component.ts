import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
export default class ExerciseSlideComponent {
  @Input() questions: { question: string; answer: string }[] = [];
  showAllAnswers = false;

  toggleAllAnswers(showAll: boolean) {
    if (showAll) {
      this.showAllAnswers = true;
    } else {
      this.showAllAnswers = false;
    }
  }
}
