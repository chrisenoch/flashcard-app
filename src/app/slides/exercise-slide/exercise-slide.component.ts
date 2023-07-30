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
export default class ExerciseSlideComponent {
  @Input() questions: { question: string; answer: string }[] = [];
  @Input() accordionState = {
    showAllTabs: false,
  };
}
