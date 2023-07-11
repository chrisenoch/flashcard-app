import { Component } from '@angular/core';

@Component({
  selector: 'app-word-slide',
  templateUrl: './word-slide.component.html',
  styleUrls: ['./word-slide.component.scss'],
})
export class WordSlideComponent {
  word = 'Hello';
  explanation = 'A very clear explanation';
}
