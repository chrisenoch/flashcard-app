import { Injectable } from '@angular/core';
import { WordItem } from './models/interfaces/wordItem';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  //words will eventually come from backend. So emulate this by using 'of' to create an observable for now.
  getWordItems() {
    return of(this.wordItems.slice());
  }

  wordItems: WordItem[] = [
    {
      id: 'word-1',
      type: 'WORD',
      english: 'Table',
      spanish: 'La mesa',
      explanation: 'Some table explanation here',
      isVisited: false,
    },
    {
      id: 'word-2',
      type: 'WORD',
      english: 'Chair',
      spanish: 'La silla',
      explanation: 'Some chair explanation here',
      isVisited: false,
    },
    {
      id: 'word-3',
      type: 'WORD',
      english: 'Door',
      spanish: 'La puerta',
      explanation: 'Some door explanation here',
      isVisited: false,
    },
  ];
}
