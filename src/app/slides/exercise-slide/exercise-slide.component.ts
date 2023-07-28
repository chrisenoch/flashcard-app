import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ChevronLeftIcon } from 'primeng/icons/chevronleft';
import { AccordionComponent } from 'src/app/custom-components/accordion/accordion.component';

@Component({
  selector: 'app-exercise-slide',
  templateUrl: './exercise-slide.component.html',
  styleUrls: ['./exercise-slide.component.scss'],
})
// implements AfterViewChecked, OnChanges
export default class ExerciseSlideComponent {
  @Input() questions: { question: string; answer: string }[] = [];
  @Input() accordionState = {
    showAllTabs: false,
  };

  ngOnChanges() {
    console.log('in ngOnChanges in exercise');
    console.log(
      ' in ngOnChanges - showAllAnswers in exercise ' +
        this.accordionState.showAllTabs
    );
    console.log('*** this.showAllAnswers ' + this.accordionState.showAllTabs);
  }
}
