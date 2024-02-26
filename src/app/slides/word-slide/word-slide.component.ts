import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-word-slide',
  templateUrl: './word-slide.component.html',
  styleUrls: ['./word-slide.component.scss'],
})
export class WordSlideComponent {
  @Input() primaryWord: string = '';
  @Input() secondaryWord: string = '';
  @Input() explanation: string = '';
  @Input() showPrimaryWordFirst: boolean = true;
  @Input() showTranslation: boolean = true;
  @Input() showExplanation: boolean = true;
}
