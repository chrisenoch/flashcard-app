import { Component, Input } from '@angular/core';
import { WordEntity } from 'src/app/models/interfaces/wordEntity';

@Component({
  selector: 'app-summary-slide',
  templateUrl: './summary-slide.component.html',
  styleUrls: ['./summary-slide.component.scss'],
})
export class SummarySlideComponent {
  @Input() wordEntities: WordEntity[] = [];
  @Input() showPrimaryWordFirst = false;
}
