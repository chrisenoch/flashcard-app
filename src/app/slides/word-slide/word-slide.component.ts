import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-word-slide',
  templateUrl: './word-slide.component.html',
  styleUrls: ['./word-slide.component.scss'],
})
export class WordSlideComponent {
  @Input() word: string | undefined = '';
  @Input() explanation: string | undefined = '';
}
