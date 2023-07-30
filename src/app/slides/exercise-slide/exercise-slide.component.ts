import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { AccordionComponent } from 'src/app/custom-components/accordion/accordion.component';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
export default class ExerciseSlideComponent implements AfterViewChecked {
  @Input() questions: { question: string; answer: string }[] = [];
  @Input() accordionState = {
    showAllTabs: false,
  };

  @ViewChild('accordionInExerciseSlide') accordion!: AccordionComponent;

  ngAfterViewChecked(): void {
    console.log(this.accordion.accordionTabs);
  }
}
