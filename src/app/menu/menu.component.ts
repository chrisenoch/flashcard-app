import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { TeachingItem } from '../models/types/teachingItem';
import { WordItem } from '../models/interfaces/wordItem';
import { SummaryItem } from '../models/interfaces/summaryItem';
import { ExerciseItem } from '../models/interfaces/exerciseItem';
import { capitalize } from '../utlities/text';
import { WordService } from '../word.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  contents: MenuItem[] = [];
  navItems: MenuItem[] | undefined;
  displayedContent: TeachingItem | undefined;
  currentPos = 0;
  maxWordsOnSummarySlide: number = 2;
  //showTranslation = false;

  //change this - set to true for now for testing
  showTranslation = true;
  showPrimaryWordFirst = true;

  wordItems: WordItem[] = [];
  summaryItems: SummaryItem[] = [];
  teachingItems: TeachingItem[] = [];

  //get these from service later
  exerciseItems: ExerciseItem[] = [
    {
      type: 'EXERCISE',
      id: 'exercise-1',
      //questions:[{"Question 1", "Answer 1"}
      questions: [
        { question: 'Question 1', answer: 'Answer 1' },
        { question: 'Question 2', answer: 'Answer 2' },
        { question: 'Question 3', answer: 'Answer 3' },
      ],
    },
  ];

  constructor(private wordService: WordService) {}

  ngOnInit() {
    this.subscription = this.wordService
      .getWordItems()
      .subscribe((wordItems: WordItem[]) => {
        this.wordItems = wordItems;
      });

    this.summaryItems = this.generateSummaryItems(
      this.maxWordsOnSummarySlide,
      this.wordItems
    );

    this.teachingItems = [
      ...this.wordItems,
      ...this.summaryItems,
      ...this.exerciseItems,
    ];

    //init first word
    this.displayedContent = this.teachingItems[this.currentPos];

    // this.contents = [
    //   {
    //     label: 'Vocabulary',
    //     expanded: true,
    //     items: this.generateContentsItems(this.wordItems, (e) => {
    //       this.updateDisplayedContent(e);
    //     }),
    //   },
    //   {
    //     label: 'Summary',
    //     items: this.generateContentsItems(this.summaryItems, (e) => {
    //       this.updateDisplayedContent(e);
    //     }),
    //   },
    //   {
    //     label: 'Exercises',
    //     items: this.generateContentsItems(this.exerciseItems, (e) => {
    //       this.updateDisplayedContent(e);
    //     }),
    //   },
    // ];
    this.contents = this.generateContents();

    this.navItems = [
      {
        label: 'Start',
        command: () => {
          this.goToStart();
        },
      },
      {
        label: 'Previous Section',
        command: () => {
          const currentId = this.teachingItems[this.currentPos].id;
          this.goToStartOfSection(currentId, true);
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
          this.goToStartOfSection(currentId);
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
        command: () => {
          this.toggleTranslation();
        },
      },
      {
        icon: 'pi-bars',
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleTranslation() {
    this.showPrimaryWordFirst = !this.showPrimaryWordFirst;
    console.log(this.showPrimaryWordFirst);
    this.contents = this.generateContents();
  }

  generateContents() {
    return [
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
        items: this.generateContentsItems(this.exerciseItems, (e) => {
          this.updateDisplayedContent(e);
        }),
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
          newLabel = this.showPrimaryWordFirst
            ? capitalize(item.english)
            : capitalize(item.spanish);
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

  //Navigates to start of next section if goToPrevious argument is not provided or set to false. Set goToPrevious to true to navigate to start of previous section.
  goToStartOfSection(currentId: string, goToPrevious?: boolean): void {
    let idNextSection: string;

    if (goToPrevious) {
      idNextSection = this.getIdOfPreviousSectionStart(currentId);
    } else {
      idNextSection = this.getIdOfNextSectionStart(currentId);
    }

    const indexNextSection = this.teachingItems.findIndex(
      (ele) => ele.id === idNextSection
    );

    this.currentPos = indexNextSection;

    this.displayedContent = this.teachingItems[this.currentPos];
  }

  getIdOfPreviousSectionStart(currentId: string): string {
    //get the part of the id that comes before the last hyphen. This part of the id represents the section.
    const currentSection = currentId.substring(0, currentId.lastIndexOf('-'));
    let previousSection: string = currentSection;
    let idOfPreviousSectionStart = currentId;
    let isInPreviousSection = false;

    //only iterate back from the current position in the array
    const filteredTeachingItems = this.teachingItems.slice(
      0,
      this.currentPos + 1
    );

    for (let i = filteredTeachingItems.length - 1; i >= 0; i--) {
      let itemId = filteredTeachingItems[i].id;
      //if is the first slide, return the id for the first slide
      if (i === 0) {
        return itemId;
      }

      //get the part of the id that comes before the last hyphen. This part of the id represents the section.
      let itemSection = itemId.substring(0, itemId.lastIndexOf('-'));

      if (isInPreviousSection) {
        //if section changes a second time, return the id of the next slide
        if (itemSection !== previousSection) {
          idOfPreviousSectionStart = filteredTeachingItems[i + 1].id;
          return idOfPreviousSectionStart;
        }
      }

      if (itemSection !== currentSection && !isInPreviousSection) {
        previousSection = itemSection; //e.g. previousSection = 'word'
        isInPreviousSection = true;
      }
    }
    return idOfPreviousSectionStart;
  }

  getIdOfNextSectionStart(currentId: string): string {
    //get the part of the id that comes before the last hyphen. This part of the id represents the section.
    const currentSection = currentId.substring(0, currentId.lastIndexOf('-'));

    //only iterate forward from the current position in the array
    const filteredTeachingItems = this.teachingItems.slice(this.currentPos);

    for (let i = 0; i < filteredTeachingItems.length; i++) {
      let itemId = filteredTeachingItems[i].id;
      //get the part of the id that comes before the last hyphen. This part of the id represents the section.
      let itemSection = itemId.substring(0, itemId.lastIndexOf('-'));

      if (itemSection !== currentSection) {
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
      console.log(this.displayedContent);
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
}
