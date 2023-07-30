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
