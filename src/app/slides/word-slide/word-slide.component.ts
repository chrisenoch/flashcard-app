import { Component, Input, OnInit } from '@angular/core';
import { Arrows } from 'src/app/custom-components/toast/models/arrows';
import { Position } from 'src/app/custom-components/toast/models/position';

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

  //to test custom toast component
  nextElements: {
    id: string;
    position: Position;
    arrows?: Arrows;
  }[] = [
    { id: 'mytest', position: 'LEFT' },
    { id: 'toast-destination-test', position: 'RIGHT' },

    { id: 'toast-destination-2', position: 'RIGHT' },
    { id: 'toast-destination-3', position: 'TOP', arrows: ['TOP', 'BOTTOM'] },
  ];
}
