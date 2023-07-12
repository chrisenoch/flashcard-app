import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
export default class ExerciseSlideComponent {
  //change this later
  @Input() word: string | undefined = '';
  @Input() explanation: string | undefined = '';
}
