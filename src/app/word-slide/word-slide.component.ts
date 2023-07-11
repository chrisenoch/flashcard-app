import { Component, Input, OnInit } from '@angular/core';
import { WordDetails } from '../models/wordDetails';

@Component({
  selector: 'app-word-slide',
  templateUrl: './word-slide.component.html',
  styleUrls: ['./word-slide.component.scss'],
})
export class WordSlideComponent {
  // Need to receive a word object (with the examples as well?)
  //Later this will be a word | summary | exercise
  @Input() word: string | undefined = '';
  @Input() explanation: string | undefined = '';

  // ngOnInit(): void {
  //   this.word = word;
  //   this.explanation = explanation;
  // }
}
