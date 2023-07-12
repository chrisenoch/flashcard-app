import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-slide',
  templateUrl: './summary-slide.component.html',
  styleUrls: ['./summary-slide.component.scss'],
})
export class SummarySlideComponent {
  //change this later
  @Input() word: string | undefined = '';
  @Input() explanation: string | undefined = '';
}
