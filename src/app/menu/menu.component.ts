import { Component } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { TeachingItem } from '../models/types/teachingItem';
import { WordItem } from '../models/interfaces/wordItem';
import { SummaryItem } from '../models/interfaces/summaryItem';
import { ExerciseItem } from '../models/interfaces/exerciseItem';
import { capitalize } from '../utlities/text';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  contents: MenuItem[] = [];
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
  teachingItems: TeachingItem[] = [...this.wordItems, ...this.summaryItems];

  ngOnInit() {
    //init first word
    this.displayedContent = this.teachingItems[this.currentPos];

    this.contents = [
      {
        label: 'Vocabulary',
        expanded: true,
        items: this.generateContentsItems(this.wordItems, (e) => {
          this.updateDisplayedContent(e);
        }),
      },
      {
        label: 'Summary',
        items: this.generateContentsItems(this.summaryItems, (e) => {
          this.updateDisplayedContent(e);
        }),
      },
      {
        label: 'Exercises',
      },
    ];

    this.navItems = [
      {
        label: 'Start',
        command: () => {
          this.goToStart();
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
        label: 'Next Section',
        command: () => {
          const currentId = this.teachingItems[this.currentPos].id;
          console.log(currentId);
          this.goToEndOfSection(currentId);
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

  generateContentsItems(
    items: TeachingItem[],
    callback: (...args: any[]) => void,
    label?: string
  ): any {
    let count = 1;
    let newLabel = '';
    const contentsItems: any[] = items.map((item) => {
      if (label === undefined) {
        if (this.isWordItem(item)) {
          newLabel = item.english;
        }
        if (this.isSummaryItem(item)) {
          newLabel = capitalize(item.type) + ' ' + count++;
        }
        if (this.isExerciseItem(item)) {
          newLabel = capitalize(item.type) + ' ' + count++;
        }
      }

      const newItem = {
        label: newLabel,
        id: item.id,
        command: callback,
      };

      return newItem;
    });

    //console.log(contentsItems);
    return contentsItems;
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
  // getNumOfcontents() {
  //   let count = 0;
  //   this.contents.forEach((item) => {
  //     if (item.items) {
  //       count += item.items?.length;
  //     }
  //   });
  //   return count;
  // }

  goToEndOfSection(currentId: string): void {
    const idNextSection = this.getIdOfNextSection(currentId);

    console.log('teaching items below');
    console.log(this.teachingItems);

    const indexNextSection = this.teachingItems.findIndex(
      (ele) => ele.id === idNextSection
    );

    this.currentPos = indexNextSection;

    this.displayedContent = this.teachingItems[this.currentPos];
  }

  getIdOfNextSection(currentId: string): string {
    //get the part of the id that comes before the last hyphen. This part of the id represents the section.
    const currentIdStart = currentId.substring(0, currentId.lastIndexOf('-'));

    for (let i = 0; i < this.teachingItems.length; i++) {
      let itemId = this.teachingItems[i].id;
      //get the part of the id that comes before the last hyphen. This part of the id represents the section.
      let itemIdStart = itemId.substring(0, itemId.lastIndexOf('-'));

      if (itemIdStart !== currentIdStart) {
        //newId = itemId;
        return itemId;
      }
    }
    return currentId;
  }

  decrementCurrentPos() {
    if (this.currentPos - 1 < 0) {
      return;
    }
    this.displayedContent = this.teachingItems[--this.currentPos];
  }

  incrementCurrentPos() {
    if (this.contents) {
      if (this.currentPos + 1 > this.teachingItems.length - 1) {
        return;
      }
      this.displayedContent = this.teachingItems[++this.currentPos];
      //console.log(this.currentPos);
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
