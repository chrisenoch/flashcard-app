import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { TeachingItem } from '../models/types/teachingItem';
import { WordItem } from '../models/interfaces/wordItem';
import { SummaryItem } from '../models/interfaces/summaryItem';
import { ExerciseItem } from '../models/interfaces/exerciseItem';
import { capitalize } from '../utlities/text';
import { WordService } from '../word.service';
import { Subject, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewChecked {
  private wordsSubscription!: Subscription;
  contents: MenuItem[] = [];
  navItems: MenuItem[] | undefined;
  displayedContent: TeachingItem | undefined;
  currentPos = 0;
  maxWordsOnSummarySlide: number = 2;
  showContentAfterWordVisited = true;
  isGeneratedContentFinished = false;
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
      isVisited: false,
    },
  ];

  constructor(
    private wordService: WordService,
    @Inject(DOCUMENT) document: Document
  ) {}

  // updateActiveWord!: () => void;

  ngAfterViewChecked() {
    //only emit the value here if generatecontents has just run?
    //if isgeneratecontentsfinished = true, emit event and then immediately set it back to false

    if (this.isGeneratedContentFinished || this.displayedContent?.isVisited) {
      console.log('displayContent id ' + this.displayedContent?.id);
      const testCont = document.querySelector('.word-3');
      console.log('testCont below');
      console.log(testCont);
      if (this.displayedContent) {
        const newActiveWordContainer = document.querySelector(
          '.' + this.displayedContent.id
        );

        console.log(newActiveWordContainer);

        //remove class from all possible places
        const wordClasses = Array.from(
          document.querySelectorAll("[class*='word']")
        );
        const summaryClasses = Array.from(
          document.querySelectorAll("[class*='summary']")
        );
        const exerciseClasses = Array.from(
          document.querySelectorAll("[class*='exercise']")
        );
        const sideBarClasses = [
          ...wordClasses,
          ...summaryClasses,
          ...exerciseClasses,
        ];

        sideBarClasses.forEach((ele) => {
          ele.classList.remove('active-word');
          ele.classList.remove('active-summary');
          ele.classList.remove('active-exercise');
        });

        if (this.isWordItem(this.displayedContent)) {
          newActiveWordContainer?.classList.add('active-word');
        }
        if (this.isSummaryItem(this.displayedContent)) {
          newActiveWordContainer?.classList.add('active-summary');
        }
        if (this.isExerciseItem(this.displayedContent)) {
          newActiveWordContainer?.classList.add('active-exercise');
        }
      }

      this.isGeneratedContentFinished = false;
    }

    console.log('inside AfterViewChecked');
    const testCont1 = document.querySelector('.word-1');
    console.log('inside AfterViewChecked - word1 below');
    console.log(testCont1);
    console.log('inside AfterViewChecked - word2 below');
    const testCont2 = document.querySelector('.word-2');
    console.log(testCont2);
    console.log('inside AfterViewChecked - word3 below');
    const testCont3 = document.querySelector('.word-3');
    console.log(testCont3);
  }

  //This method must be called in ngonInit with init set to true in order to set-up the subscription.
  // updateActiveWord(init?: boolean) {
  //   if (init) {
  //     this.isGenerateContentsFinishedSubscription =
  //       this.isGenerateContentsFinishedSubject.subscribe(() => {
  //         // setTimeout(() => {
  //         console.log('SUBSCRIPTIN CALLBACK RUNS');
  //         console.log('displayContent id ' + this.displayedContent?.id);
  //         const testCont = document.querySelector('.word-3');
  //         console.log('testCont below');
  //         console.log(testCont);
  //         if (this.displayedContent) {
  //           const newActiveWordContainer = document.querySelector(
  //             '.' + this.displayedContent.id
  //           );

  //           console.log(newActiveWordContainer);

  //           //remove class from all possible places
  //           const sideBarClasses = document.querySelectorAll("[class*='word']");
  //           sideBarClasses.forEach((ele) => {
  //             ele.classList.remove('active-word');
  //           });

  //           //add new class to the word container
  //           newActiveWordContainer?.classList.add('active-word');
  //         }
  //         // }, 3000);
  //       });
  //   }
  // }

  ngOnInit() {
    this.wordsSubscription = this.wordService
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
          this.addWordToContents();
        },
      },
      {
        label: 'Next',
        command: () => {
          this.incrementCurrentPos();
          this.addWordToContents();
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
        label: 'Show words after visited',
        command: () => {
          this.showContentAfterWordVisited = !this.showContentAfterWordVisited;
          this.contents = this.generateContents();
        },
      },
      {
        icon: 'pi-bars',
      },
    ];
  }

  ngOnDestroy(): void {
    this.wordsSubscription.unsubscribe();
    //this.isGenerateContentsFinishedSubscription.unsubscribe();
  }

  onStart() {
    this.goToStart();
    this.displayedContent && this.setItemAsVisited(this.displayedContent);
  }

  onEnd() {
    this.goToEnd();
    this.displayedContent && this.setItemAsVisited(this.displayedContent);
  }
  onPrevious() {
    this.decrementCurrentPos();
    //this.addWordToContents();
    //this.updateActiveWord();
    this.displayedContent && this.setItemAsVisited(this.displayedContent);
  }
  onPreviousSection() {
    const currentId = this.teachingItems[this.currentPos].id;
    this.goToStartOfSection(currentId, true);
    this.displayedContent && this.setItemAsVisited(this.displayedContent);
  }
  onNext() {
    this.incrementCurrentPos();
    //this.addWordToContents();
    //this.updateActiveWord();
    this.displayedContent && this.setItemAsVisited(this.displayedContent);
  }
  onNextSection() {
    const currentId = this.teachingItems[this.currentPos].id;
    this.goToStartOfSection(currentId);
    this.displayedContent && this.setItemAsVisited(this.displayedContent);
  }

  onToggle() {
    this.toggleTranslation();
  }

  onShowWordsAftervisited() {
    this.showContentAfterWordVisited = !this.showContentAfterWordVisited;
    this.contents = this.generateContents();
  }

  toggleTranslation() {
    this.showPrimaryWordFirst = !this.showPrimaryWordFirst;
    this.contents = this.generateContents();
  }

  generateContents() {
    console.log('in generate contents');
    const generatedContents = [
      {
        label: 'Vocabulary',
        //icon: 'pi pi-bolt',
        icon: 'bi bi-record-fill',
        expanded: true,
        items: this.generateContentsItems(this.wordItems, (e) => {
          this.updateDisplayedContent(e);
        }),
      },
      {
        label: 'Summary',
        icon: 'bi bi-record-fill',
        items: this.generateContentsItems(this.summaryItems, (e) => {
          this.updateDisplayedContent(e);
        }),
      },
      {
        label: 'Exercises',
        icon: 'bi bi-record-fill',
        items: this.generateContentsItems(this.exerciseItems, (e) => {
          this.updateDisplayedContent(e);
        }),
      },
    ];

    // console.log('in generatedContents() - just before emit true');
    // this.isGenerateContentsFinishedSubject.next(true);
    // console.log('in generatedContents() - just after emit true');

    this.isGeneratedContentFinished = true;

    return generatedContents;
  }

  generateContentsItems(
    items: TeachingItem[],
    callback: (...args: any[]) => void,
    label?: string
  ): any {
    let count = 1;
    let newLabel = '';
    let itemClass = '';
    const contentsItems: any[] = items

      .filter((item, i) => {
        //don't show vocab word until it has been visited if showContentAfterWordVisited is true
        if (
          i !== 0 &&
          this.showContentAfterWordVisited &&
          this.isWordItem(item) &&
          !item.isVisited
        ) {
          return false;
        } else {
          return true;
        }
      })

      .map((item) => {
        if (label === undefined) {
          if (this.isWordItem(item)) {
            newLabel = this.showPrimaryWordFirst
              ? capitalize(item.english)
              : capitalize(item.spanish);
            itemClass = 'word ' + item.id;
          }
          if (this.isSummaryItem(item)) {
            newLabel = capitalize(item.type) + ' ' + count++;
            itemClass = 'summary ' + item.id;
          }
          if (this.isExerciseItem(item)) {
            newLabel = capitalize(item.type) + ' ' + count++;
            itemClass = 'exercise ' + item.id;
          }
        }

        const newItem = {
          label: newLabel,
          styleClass: itemClass,
          icon: 'bi bi-record2',
          id: item.id,
          command: callback,
        };

        console.log('end of generateItems method');
        return newItem;
      });

    // console.log('content items below');
    // console.log(contentsItems);

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
      isVisited: false,
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
          isVisited: false,
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

  // setItemAsVisited(item: TeachingItem) {
  //   item.isVisited = true;
  // }

  setItemAsVisited(item: TeachingItem) {
    if (item.isVisited) {
      return;
    }

    if (this.isWordItem(item)) {
      item.isVisited = true;
      this.contents = this.generateContents();
    } else {
      item.isVisited = true;
    }
  }

  // updateActiveItem() {
  //   if (this.displayedContent) {
  //     if (this.displayedContent.isVisited) {
  //       return;
  //     } else {
  //       this.setItemAsVisited(this.displayedContent);
  //     }
  //   }
  // }

  addWordToContents() {
    if (this.displayedContent && this.isWordItem(this.displayedContent)) {
      const wordItem = this.displayedContent;

      if (wordItem.isVisited) {
        //don't generate contents again if word is already shown on the contents bar
        return;
      } else {
        this.setItemAsVisited(wordItem);
        this.contents = this.generateContents();
      }
    }
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
