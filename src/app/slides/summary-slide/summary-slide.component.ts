import { Component, Input } from '@angular/core';
import { WordItem } from 'src/app/models/interfaces/wordItem';

@Component({
  selector: 'app-summary-slide',
  templateUrl: './summary-slide.component.html',
  styleUrls: ['./summary-slide.component.scss'],
})
export class SummarySlideComponent {
  @Input() wordItems: WordItem[] = [];
  @Input() showPrimaryWordFirst = false;
}
