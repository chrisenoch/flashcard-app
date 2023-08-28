import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { TeachingItem } from '../models/types/teachingItem';
import { TEACHING_ITEM } from '../models/enums/teaching_item';
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
  displayedContent: TeachingItem | undefined;
  contents: MenuItem[] = [];
  wordContents: MenuItem[] = [];
  summaryContents: MenuItem[] = [];
  exerciseContents: MenuItem[] = [];
  isTeachingItemsError = false;
  sidebarsOnRight = false;
  //change this - set to true for now for testing
  //showTranslation = false;
  showTranslation = true;
  showExplanation = true;
  showPrimaryWordFirst = false;
  slideNavbarPos: 'LEFT' | 'MIDDLE' | 'RIGHT' = 'MIDDLE';
  accordionState = { showAllTabs: false };

  private wordsSubscription!: Subscription;
  private currentPos = 0;
  private autoExpandVocabulary = true;
  private autoExpandSummary = false;
  private autoExpandExercises = false;

  //user-defined preference set when user expands/closes the sidebar section. Null means the user has never expanded or closed the section.
  private wantsVocabularyExpanded: boolean | null = null;
  private wantsSummaryExpanded: boolean | null = null;
  private wantsExercisesExpanded: boolean | null = null;
  private maxWordsOnSummarySlide: number = 16;
  //showContentAfterWordVisited = true;
  private showContentAfterWordVisited = false;
  private isGeneratedContentFinished = false;

  private wordItems: WordItem[] = [];
  private summaryItems: SummaryItem[] = [];
  private teachingItems: TeachingItem[] = [];

  //get these from service later
  private exerciseItems: ExerciseItem[] = [
    {
      type: TEACHING_ITEM.Exercise,
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
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) document: Document
  ) {}

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

    if (this.teachingItems.length < 1) {
      this.isTeachingItemsError = true;
      return;
    }

    this.wordContents = this.generateContentsItems(this.wordItems, (e) => {
      this.updateDisplayedContent(e);
    });

    this.summaryContents = this.generateContentsItems(
      this.summaryItems,
      (e) => {
        this.updateDisplayedContent(e);
      }
    );

    this.exerciseContents = this.generateContentsItems(
      this.exerciseItems,
      (e) => {
        this.updateDisplayedContent(e);
      }
    );

    this.contents = this.generateContents();

    //init first word
    this.displayedContent = this.teachingItems[this.currentPos];
  }

  ngAfterViewChecked() {
    this.updateActiveWordOnSidebar();
  }

  ngOnDestroy(): void {
    this.wordsSubscription.unsubscribe();
  }

  private getTeachingItemById(id: string) {
    return this.teachingItems.find((item) => {
      item.id === id;
    });
  }

  updateContentAfterWordVisited() {
    console.log('in updateContentsAfterWordVisited');
    this.showContentAfterWordVisited = !this.showContentAfterWordVisited;
    //this.contents = this.generateContents();

    //find wordItems to show
    const worditemIdsToShow = this.wordItems
      .filter((item, i) => {
        const shouldShow = this.getWordItemsToBeShown(item, i);
        return shouldShow;
      })
      .map((item) => item.id);
    const worditemIdsToShowSet = new Set(worditemIdsToShow);

    this.contents[0].items = this.wordContents?.filter((item: MenuItem) => {
      let teachingItem;
      if (item && item.id) {
        teachingItem = this.getTeachingItemById(item.id);
        //if not a word item then always return
        if (teachingItem && !this.isWordItem(teachingItem)) {
          return true;
        } else {
          return worditemIdsToShowSet.has(item.id);
        }
      } else {
        return true;
      }
    });

    this.contents = [...this.contents];
  }

  updateShowTranslation() {
    this.showTranslation = !this.showTranslation;
  }

  updateToggleTranslation() {
    this.showPrimaryWordFirst = !this.showPrimaryWordFirst;
    this.contents = this.generateContents();
    //New approach
    //Just run second half of generateContents
  }

  updateShowAllExerciseAnswers() {
    const accordionStateCopy = { ...this.accordionState };
    accordionStateCopy.showAllTabs = true;
    this.accordionState = accordionStateCopy;
  }

  updateHideAllExerciseAnswers() {
    const accordionStateCopy = { ...this.accordionState };
    accordionStateCopy.showAllTabs = false;
    this.accordionState = accordionStateCopy;
  }

  updateShowExplanation() {
    this.showExplanation = !this.showExplanation;
  }

  updateSidebarsOnRight() {
    this.sidebarsOnRight = !this.sidebarsOnRight;

    if (this.slideNavbarPos === 'RIGHT') {
      this.slideNavbarPos = 'LEFT';
    } else if (this.slideNavbarPos === 'LEFT') {
      this.slideNavbarPos = 'RIGHT';
    }
  }

  updateSlideNavbarPos() {
    //problem is the arrow

    if (this.slideNavbarPos === 'MIDDLE') {
      this.slideNavbarPos = 'RIGHT';
    } else if (this.slideNavbarPos === 'RIGHT') {
      this.slideNavbarPos = 'LEFT';
    } else if (this.slideNavbarPos === 'LEFT') {
      this.slideNavbarPos = 'MIDDLE';
    }
  }

  //proper approach
  isWordItem(item: TeachingItem): item is WordItem {
    return (item as WordItem).type === TEACHING_ITEM.Word;
  }

  isSummaryItem(item: TeachingItem): item is SummaryItem {
    return (item as SummaryItem).type === TEACHING_ITEM.Summary;
  }

  isExerciseItem(item: TeachingItem): item is ExerciseItem {
    return (item as ExerciseItem).type === TEACHING_ITEM.Exercise;
  }

  onStart() {
    this.goToStart();
    this.onBottomNavigationCommon();
  }

  onEnd() {
    this.goToEnd();
    this.onBottomNavigationCommon();
  }
  onPrevious() {
    this.decrementCurrentPos();
    this.onBottomNavigationCommon();
  }
  onPreviousSection() {
    const currentId = this.teachingItems[this.currentPos].id;
    this.goToStartOfSection(currentId, true);
    this.onBottomNavigationCommon();
  }
  onNext() {
    this.incrementCurrentPos();
    //this.addWordToContents();
    //this.updateActiveWord();
    this.onBottomNavigationCommon();
  }
  onNextSection() {
    const currentId = this.teachingItems[this.currentPos].id;
    this.goToStartOfSection(currentId);
    this.onBottomNavigationCommon();
  }

  onShowWordsAftervisited() {
    this.showContentAfterWordVisited = !this.showContentAfterWordVisited;
    this.contents = this.generateContents();
    //New approach
    //Only update contents items for relevant section
  }

  //methods to be called on every bottom navigation method
  private onBottomNavigationCommon() {
    this.displayedContent && this.setItemAsVisited(this.displayedContent);
    this.autoExpandSection();
  }

  //the default behaviour is for the sections on the sidebar
  //to expand when a slide of that section is visited. However,
  //the user can override this by opening/closing the section. In this case, the user's preference is honoured.
  private autoExpandSection() {
    if (
      this.displayedContent?.type === TEACHING_ITEM.Word &&
      !this.autoExpandVocabulary &&
      this.wantsVocabularyExpanded === null
    ) {
      this.autoExpandVocabulary = true;
      this.contents = this.generateContents();
    }
    if (
      this.displayedContent?.type === TEACHING_ITEM.Summary &&
      !this.autoExpandSummary &&
      this.wantsSummaryExpanded === null
    ) {
      this.autoExpandSummary = true;
      this.contents = this.generateContents();
    }
    if (
      this.displayedContent?.type === TEACHING_ITEM.Exercise &&
      !this.autoExpandExercises &&
      this.wantsExercisesExpanded === null
    ) {
      this.autoExpandExercises = true;
      this.contents = this.generateContents();
    }
  }

  private updateWantsExpanded(e: MenuItemCommandEvent) {
    //find out expanded state of clicked on section
    let expandSection;
    if (e?.item?.expanded !== undefined && e?.item?.expanded !== null) {
      expandSection = e.item.expanded;
    } else {
      return;
    }

    //get expanded state of all sections
    const expandedStates = new Map();
    this.contents.forEach((ele) => {
      expandedStates.set(ele.label, ele.expanded);
    });

    //if selected section is open update wantsExpanded of selected section to false.
    if (!expandSection) {
      //Also update wantsExpanded of all closed sections to false.
      this.contents.forEach((ele) => {
        let expanded = expandedStates.get(ele.label);
        if (!expanded) {
          if (ele.id === TEACHING_ITEM.Word) {
            this.wantsVocabularyExpanded = false;
          }
          if (ele.id === TEACHING_ITEM.Summary) {
            this.wantsSummaryExpanded = false;
          }
          if (ele.id === TEACHING_ITEM.Exercise) {
            this.wantsExercisesExpanded = false;
          }
        }
      });
    } else {
      //if selected section is open, update wantsExpanded to true for only the selected section
      if (e.item.id === TEACHING_ITEM.Word) {
        this.wantsVocabularyExpanded = true;
      }
      if (e.item.id === TEACHING_ITEM.Summary) {
        this.wantsSummaryExpanded = true;
      }
      if (e.item.id === TEACHING_ITEM.Exercise) {
        this.wantsExercisesExpanded = true;
      }
    }
    this.contents = this.generateContents();
  }

  private decideIfVocabularyExpanded() {
    if (this.wantsVocabularyExpanded === null) {
      return this.autoExpandVocabulary;
    }
    if (this.wantsVocabularyExpanded) {
      return true;
    } else {
      return false;
    }
  }

  private decideIfSummaryExpanded() {
    if (this.wantsSummaryExpanded === null) {
      return this.autoExpandSummary;
    }
    if (this.wantsSummaryExpanded) {
      return true;
    } else {
      return false;
    }
  }

  private decideIfExercisesExpanded() {
    if (this.wantsExercisesExpanded === null) {
      return this.autoExpandExercises;
    }
    if (this.wantsExercisesExpanded) {
      return true;
    } else {
      return false;
    }
  }

  private updateActiveWordOnSidebar() {
    if (this.isGeneratedContentFinished || this.displayedContent?.isVisited) {
      if (this.displayedContent) {
        const newActiveWordContainer = document.querySelector(
          '.' + this.displayedContent.id
        );

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
  }

  private generateContents() {
    const isVocabularyExpanded = this.decideIfVocabularyExpanded();
    const isSummaryExpanded = this.decideIfSummaryExpanded();
    const isExercisesExpanded = this.decideIfExercisesExpanded();

    const generatedContents = [
      {
        label: 'Vocabulary',
        id: TEACHING_ITEM.Word,
        //icon: 'pi pi-bolt',
        icon: 'bi bi-record-fill',
        expanded: isVocabularyExpanded,
        command: (e: MenuItemCommandEvent) => {
          this.updateWantsExpanded(e);
        },
        items: this.wordContents,
      },
      {
        label: 'Summary',
        id: TEACHING_ITEM.Summary,
        icon: 'bi bi-record-fill',
        expanded: isSummaryExpanded,
        command: (e: MenuItemCommandEvent) => {
          this.updateWantsExpanded(e);
        },
        items: this.summaryContents,
      },
      {
        label: 'Exercises',
        id: TEACHING_ITEM.Exercise,
        icon: 'bi bi-record-fill',
        expanded: isExercisesExpanded,
        command: (e: MenuItemCommandEvent) => {
          this.updateWantsExpanded(e);
        },
        items: this.exerciseContents,
      },
    ];

    this.isGeneratedContentFinished = true;

    return generatedContents;
  }

  private getWordItemsToBeShown(item: TeachingItem, index: number): boolean {
    if (
      index !== 0 &&
      this.showContentAfterWordVisited &&
      this.isWordItem(item) &&
      !item.isVisited
    ) {
      return false;
    } else {
      return true;
    }
  }

  private generateContentsItems(
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
        return this.getWordItemsToBeShown(item, i);
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

        return newItem;
      });

    return contentsItems;
  }

  private generateSummaryItems(
    wordsPerPage: number,
    wordItems: WordItem[]
  ): SummaryItem[] {
    if (wordsPerPage < 1) {
      return [];
    }

    let count = 1;
    const type = TEACHING_ITEM.Summary;
    const summaryItems: SummaryItem[] = [];

    let summaryItem: SummaryItem = {
      id: 'summary-',
      type,
      wordItems: [],
      isVisited: false,
    };

    wordItems.forEach((wordItem, i, arr) => {
      summaryItem.id = 'summary-' + count;
      //continue adding wordItems to wordItems array on object until wordsPerPage = 8;
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

  private setItemAsVisited(item: TeachingItem) {
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

  private addWordToContents() {
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
  private goToStartOfSection(currentId: string, goToPrevious?: boolean): void {
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

  private getIdOfPreviousSectionStart(currentId: string): string {
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

  private getIdOfNextSectionStart(currentId: string): string {
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

  private decrementCurrentPos() {
    if (this.currentPos - 1 < 0) {
      return;
    }
    this.displayedContent = this.teachingItems[--this.currentPos];
  }

  private incrementCurrentPos() {
    if (this.contents) {
      if (this.currentPos + 1 > this.teachingItems.length - 1) {
        return;
      }
      this.displayedContent = this.teachingItems[++this.currentPos];
    }
  }

  private goToStart() {
    this.currentPos = 0;
    this.displayedContent = this.teachingItems[this.currentPos];
  }
  private goToEnd() {
    this.currentPos = this.teachingItems.length - 1;
    this.displayedContent = this.teachingItems[this.currentPos];
  }

  private updateDisplayedContent(e: MenuItemCommandEvent) {
    console.log('updateDisplayedContent');
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

        this.setItemAsVisited(this.displayedContent);
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
