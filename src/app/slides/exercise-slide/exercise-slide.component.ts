import { Component, Input } from '@angular/core';
import { ChevronLeftIcon } from 'primeng/icons/chevronleft';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
export default class ExerciseSlideComponent {
  @Input() questions: { question: string; answer: string }[] = [];
  @Input() showAllAnswers = false;

  ngOnChanges() {
    console.log('in ngOnChanges in exercise');
    console.log('showAllAnswers in exercise ' + this.showAllAnswers);
  }

  toggleAllAnswers(showAll: boolean) {
    if (showAll) {
      this.showAllAnswers = true;
    } else {
      this.showAllAnswers = false;
    }
  }
}
