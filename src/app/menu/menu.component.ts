import { Component } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { TeachingItem } from '../models/types/teachingItem';
import { WordItem } from '../models/interfaces/wordItem';
import { SummaryItem } from '../models/interfaces/summaryItem';
import { ExerciseItem } from '../models/interfaces/exerciseItem';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  contentItems: MenuItem[] = [];
  navItems: MenuItem[] | undefined;
  displayedContent: TeachingItem | undefined;
  currentPos = 0;
  maxWordsOnSummarySlide: number = 2;

  wordItems: WordItem[] = [
    {
      id: 'word-1',
      type: 'WORD',
      english: 'Table',
      spanish: 'La mesa',
      explanation: 'Some table explanation here',
    },
    {
      id: 'word-2',
      type: 'WORD',
      english: 'Chair',
      spanish: 'La silla',
      explanation: 'Some chair explanation here',
    },
    {
      id: 'word-3',
      type: 'WORD',
      english: 'Door',
      spanish: 'La puerta',
      explanation: 'Some door explanation here',
    },
  ];

  summaryItems: SummaryItem[] = this.generateSummaryItems(
    this.maxWordsOnSummarySlide,
    this.wordItems
  );

  //get these from service later
  //words for now, but this may include other objects later
  teachingItems: TeachingItem[] = [...this.wordItems, ...this.summaryItems];

  ngOnInit() {
    //init first word
    this.displayedContent = this.teachingItems[this.currentPos];

    this.contentItems = [
      {
        label: 'Vocabulary',
        expanded: true,
        items: [
          {
            label: 'Table',
            id: 'word-1',
            command: (e) => {
              this.updateDisplayedContent(e);
            },
          },
          {
            label: 'Chair',
            id: 'word-2',
            command: (e) => {
              this.updateDisplayedContent(e);
            },
          },
          {
            label: 'Door',
            id: 'word-3',
            command: (e) => {
              this.updateDisplayedContent(e);
            },
          },
        ],
      },
      {
        label: 'Summary',
        items: [
          {
            label: 'Vocabulary',
            id: 'summary-1',
            command: (e) => {
              this.updateDisplayedContent(e);
            },
          },
        ],
      },
      {
        label: 'Exercises',
        // items: [
        //   {
        //     label: 'Exercise 1',
        //   },
        //   {
        //     label: 'Exercise 2',
        //   },
        //   {
        //     label: 'Exercise 3',
        //   },
        // ],
      },
    ];

    this.navItems = [
      {
        label: 'Start',
        command: () => {
          this.goToStart();
        },
        id: 'fun-value',
        state: {
          department: 'HR',
          position: 'manager',
        },
      },
      {
        label: 'Previous',
        command: () => {
          this.decrementCurrentPos();
        },
      },
      {
        label: 'Next',
        command: () => {
          this.incrementCurrentPos();
        },
      },
      {
        label: 'End',
        command: () => {
          this.goToEnd();
        },
      },
      {
        label: 'Toggle',
      },
      {
        icon: 'pi-bars',
      },
    ];
  }

  generateSummaryItems(
    wordsPerPage: number,
    wordItems: WordItem[]
  ): SummaryItem[] {
    if (wordsPerPage < 1) {
      return [];
    }

    let count = 1;
    const type = 'SUMMARY';
    const summaryItems: SummaryItem[] = [];

    let summaryItem: SummaryItem = {
      id: 'summary-',
      type,
      wordItems: [],
    };

    wordItems.forEach((wordItem, i, arr) => {
      summaryItem.id = 'summary-' + count;
      //continue adding wordItems to wordItems array on object until i = 8;
      summaryItem.wordItems.push(wordItem);

      //if last iteration, add the remaining summaryItem and end loop early
      if (i === arr.length - 1) {
        summaryItems.push(summaryItem);
        return;
      }

      if ((i + 1) % wordsPerPage === 0) {
        //when the wordsPerPage limit is reached, we add the SummaryItem to summaryItems
        //add to main summaryItems array
        summaryItems.push(summaryItem);
        //increment count
        count++;

        summaryItem = {
          id: 'summary-',
          type,
          wordItems: [],
        };
      }
    });

    console.log('summaryItems below');
    console.log(summaryItems);

    return summaryItems;
  }

  //proper approach
  isWordItem(item: TeachingItem): item is WordItem {
    return (item as WordItem).type === 'WORD';
  }

  isSummaryItem(item: TeachingItem): item is SummaryItem {
    return (item as SummaryItem).type === 'SUMMARY';
  }

  isExerciseItem(item: TeachingItem): item is ExerciseItem {
    return (item as ExerciseItem).type === 'EXERCISE';
  }

  //this only checks items one-level deep
  // getNumOfContentItems() {
  //   let count = 0;
  //   this.contentItems.forEach((item) => {
  //     if (item.items) {
  //       count += item.items?.length;
  //     }
  //   });
  //   return count;
  // }

  decrementCurrentPos() {
    if (this.currentPos - 1 < 0) {
      return;
    }
    this.displayedContent = this.teachingItems[--this.currentPos];
  }

  incrementCurrentPos() {
    if (this.contentItems) {
      if (this.currentPos + 1 > this.teachingItems.length - 1) {
        return;
      }
      this.displayedContent = this.teachingItems[++this.currentPos];
      console.log(this.currentPos);
    }
  }

  goToStart() {
    this.currentPos = 0;
    this.displayedContent = this.teachingItems[this.currentPos];
  }
  goToEnd() {
    this.currentPos = this.teachingItems.length - 1;
    this.displayedContent = this.teachingItems[this.currentPos];
  }

  updateDisplayedContent(e: MenuItemCommandEvent) {
    if (e?.item?.id) {
      const id = e.item.id;
      const newDisplayedContent = this.teachingItems.find(
        (itemDetails) => id === itemDetails.id
      );

      if (newDisplayedContent) {
        this.displayedContent = newDisplayedContent;

        this.currentPos = this.teachingItems.findIndex(
          (ele) => ele.id === this.displayedContent!.id
        );
      }
    }
  }
}
