import { Injectable } from '@angular/core';
import { WordEntity } from './models/interfaces/wordEntity';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  //words will eventually come from backend. So emulate this by using 'of' to create an observable for now.
  getWordEntities() {
    return of(this.wordEntities.slice());
  }

  wordEntities: WordEntity[] = [
    {
      id: 'word-1',
      kind: 'WORD',
      english: 'Table',
      spanish: 'La mesa',
      explanation:
        'A flat surface, usually supported by four legs, used for putting things on',
      isVisited: false,
    },
    {
      id: 'word-2',
      kind: 'WORD',
      english: 'Chair',
      spanish: 'La silla',
      explanation: 'Some chair explanation here',
      isVisited: false,
    },
    {
      id: 'word-3',
      kind: 'WORD',
      english: 'Door',
      spanish: 'La puerta',
      explanation: 'Some door explanation here',
      isVisited: false,
    },
    {
      id: 'word-4',
      kind: 'WORD',
      english: 'Lamp',
      spanish: 'La lámpara',
      explanation: 'Some explanation here',
      isVisited: false,
    },
    {
      id: 'word-5',
      kind: 'WORD',
      english: 'Bedside table',
      spanish: 'La mesita de noche',
      explanation: 'Some explanation here',
      isVisited: false,
    },
    {
      id: 'word-6',
      kind: 'WORD',
      english: 'Bookcase',
      spanish: 'La estantería',
      explanation: 'Some explanation here',
      isVisited: false,
    },
    {
      id: 'word-7',
      kind: 'WORD',
      english: 'Wardrobe',
      spanish: 'El armario',
      explanation: 'Some explanation here',
      isVisited: false,
    },
    // {
    //   id: 'word-8',
    //   type: 'WORD',
    //   english: 'Mirror',
    //   spanish: 'El espejo',
    //   explanation: 'Some explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-9',
    //   type: 'WORD',
    //   english: 'Drawer',
    //   spanish: 'El cajón',
    //   explanation: 'Some explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-10',
    //   type: 'WORD',
    //   english: 'Table2',
    //   spanish: 'La mesa2',
    //   explanation: 'Some table2 explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-11',
    //   type: 'WORD',
    //   english: 'Chair2',
    //   spanish: 'La silla2',
    //   explanation: 'Some chair2 explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-12',
    //   type: 'WORD',
    //   english: 'Door2',
    //   spanish: 'La puerta2',
    //   explanation: 'Some door2 explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-13',
    //   type: 'WORD',
    //   english: 'Table3',
    //   spanish: 'La mesa3',
    //   explanation: 'Some table3 explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-14',
    //   type: 'WORD',
    //   english: 'Chair3',
    //   spanish: 'La silla3',
    //   explanation: 'Some chair3 explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-15',
    //   type: 'WORD',
    //   english: 'Door3',
    //   spanish: 'La puerta3',
    //   explanation: 'Some door3 explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-16',
    //   type: 'WORD',
    //   english: 'Table4',
    //   spanish: 'La mesa4',
    //   explanation: 'Some table4 explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-17',
    //   type: 'WORD',
    //   english: 'Chair4',
    //   spanish: 'La silla4',
    //   explanation: 'Some chair4 explanation here',
    //   isVisited: false,
    // },
    // {
    //   id: 'word-18',
    //   type: 'WORD',
    //   english: 'Door4',
    //   spanish: 'La puerta4',
    //   explanation: 'Some door4 explanation here',
    //   isVisited: false,
    // },
  ];
}
