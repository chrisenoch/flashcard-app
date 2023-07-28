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
  @Input() showAllAnswers = false;

  @Input() showAllAnswersNum = 'THREE';

  updateActiveTabs = false;

  ngOnChanges() {
    console.log('in ngOnChanges in exercise');
    console.log(
      ' in ngOnChanges - showAllAnswers in exercise ' + this.showAllAnswers
    );
  }

  // @ViewChild('accordionRef') accordion!: AccordionComponent;

  // ngAfterViewChecked() {
  //   console.log(JSON.stringify(this.accordion.contentChildren));
  //   const accordionTabs = this.accordion.contentChildren;

  //   if (this.updateActiveTabs) {
  //     if (this.showAllAnswers) {
  //       accordionTabs.forEach((ele) => {
  //         ele.isActive = true;
  //       });
  //     } else {
  //       accordionTabs.forEach((ele) => {
  //         ele.isActive = false;
  //       });
  //     }

  //     this.updateActiveTabs = false;
  //     //necessary to avoid "ExpressionChangedAfterItHasBeenCheckedError"
  //     setTimeout(() => console.log('tick'), 0);
  //   }
  // }

  // toggleAllAnswers(showAll: boolean) {
  //   if (showAll) {
  //     this.showAllAnswers = true;
  //   } else {
  //     this.showAllAnswers = false;
  //   }
  //   this.updateActiveTabs = true;
  // }
}
