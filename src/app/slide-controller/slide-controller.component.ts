import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { WordEntity } from '../models/interfaces/wordEntity';
import { SummaryEntity } from '../models/interfaces/summaryEntity';
import { ExerciseEntity } from '../models/interfaces/exerciseEntity';
import { capitalize } from '../utlities/text';
import { WordService } from '../word.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { TEACHING_ENUM } from '../models/enums/teaching_enum';
import { TeachingEntity } from '../models/types/teachingEntity';

@Component({
  selector: 'app-slide-controller',
  templateUrl: './slide-controller.component.html',
  styleUrls: ['./slide-controller.component.scss'],
})
export class SlideControllerComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  displayedContentInSlide: TeachingEntity | undefined;
  sidebarMenuItems: MenuItem[] = [];
  private vocabSidebarMenuItems: MenuItem[] = [];
  private summarySidebarMenuItems: MenuItem[] = [];
  private exerciseSidebarMenuItems: MenuItem[] = [];
  private vocabMenuItemsToShow: MenuItem[] = [];
  isTeachingEntityError = false;
  sidebarsOnRight = false;
  //change this - set to true for now for testing
  //showTranslation = false;
  showTranslation = true;
  showExplanation = true;
  showPrimaryWordFirst = false;
  slideNavbarPos: 'LEFT' | 'MIDDLE' | 'RIGHT' = 'MIDDLE';
  accordionState = { showAllTabs: false };

  private wordsSubscription$!: Subscription;
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
  private runUpdateActiveWordsOnSidebar = false;

  private vocabSection: MenuItem | null = null;
  private summarySection: MenuItem | null = null;
  private exerciseSection: MenuItem | null = null;

  private wordEntities: WordEntity[] = [];
  private summaryEntities: SummaryEntity[] = [];
  private teachingEntities: TeachingEntity[] = [];
  //get these from service later
  private exerciseEntities: ExerciseEntity[] = [
    {
      kind: TEACHING_ENUM.Exercise,
      id: 'exercise-1',
      questions: [
        {
          question: '1. Sed do eiusmod tempor incididunt ut ?',
          answer:
            'In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        },
        {
          question: '2. Exercitation ullamco laboris nisi ut aliquip e?',
          answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          question: '3. Quae ab illo inventore veritatis et?',
          answer:
            'Architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam',
        },
        {
          question: '4. Exercitation4 ullamco laboris nisi ut aliquip e?',
          answer: 'Lorem4 ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          question: '5. Exercitation ullamco laboris nisi ut aliquip e?',
          answer: 'Lorem5 ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          question: '6. Exercitation ullamco laboris nisi ut aliquip e?',
          answer: 'Lorem6 ipsum dolor sit amet, consectetur adipiscing elit',
        },
      ],
      isVisited: false,
    },
    {
      kind: TEACHING_ENUM.Exercise,
      id: 'exercise-2',
      //questions:[{"Question 1", "Answer 1"}
      questions: [
        {
          question: '1. Sed do eiusmod tempor incididunt ut ?',
          answer:
            'In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        },
        {
          question: '2. Exercitation ullamco laboris nisi ut aliquip e?',
          answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          question: '3. Quae ab illo inventore veritatis et?',
          answer:
            'Architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam',
        },
        {
          question: '4. Exercitation4 ullamco laboris nisi ut aliquip e?',
          answer: 'Lorem4 ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          question: '5. Exercitation ullamco laboris nisi ut aliquip e?',
          answer: 'Lorem5 ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          question: '6. Exercitation ullamco laboris nisi ut aliquip e?',
          answer: 'Lorem6 ipsum dolor sit amet, consectetur adipiscing elit',
        },
      ],
      isVisited: false,
    },
  ];

  constructor(
    private wordService: WordService,
    @Inject(DOCUMENT) private injectedDocument: Document
  ) {}

  ngOnInit() {
    this.generateTeachingEntities();

    if (this.teachingEntities.length < 1) {
      this.isTeachingEntityError = true;
      return;
    }

    this.prepareSideBarMenuItems();

    this.sidebarMenuItems = this.generateSideBarMenuItems();

    //init first word
    this.displayedContentInSlide = this.teachingEntities[this.currentPos];
  }

  ngAfterViewChecked() {
    if (this.runUpdateActiveWordsOnSidebar) {
      this.updateActiveWordOnSidebar();
    }
  }

  ngOnDestroy(): void {
    this.wordsSubscription$.unsubscribe();
  }

  updateContentAfterWordVisited() {
    this.showContentAfterWordVisited = !this.showContentAfterWordVisited;
    this.updateWordEntitiesToBeShownOnSidebar();
  }

  updateShowTranslation() {
    this.showTranslation = !this.showTranslation;
  }

  updateToggleTranslation() {
    this.showPrimaryWordFirst = !this.showPrimaryWordFirst;
    this.vocabSidebarMenuItems.forEach((menuItem) => {
      let teachingEntity;
      if (menuItem.id) {
        teachingEntity = this.getTeachingEntityById(menuItem.id);
      }

      if (teachingEntity && this.isWordEntity(teachingEntity)) {
        menuItem.label = this.showPrimaryWordFirst
          ? capitalize(teachingEntity.english)
          : capitalize(teachingEntity.spanish);
      }
    });
    this.sidebarMenuItems = [...this.sidebarMenuItems];
  }

  updateShowAllExerciseAnswers() {
    // Changes to the accordionState are only recognised by the Accordion
    // if the object reference changes. This is an implemntation detail of the Accordion.
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
  isWordEntity(teachingEntity: TeachingEntity): teachingEntity is WordEntity {
    return (teachingEntity as WordEntity).kind === TEACHING_ENUM.Word;
  }

  isSummaryEntity(
    teachingEntity: TeachingEntity
  ): teachingEntity is SummaryEntity {
    return (teachingEntity as SummaryEntity).kind === TEACHING_ENUM.Summary;
  }

  isExerciseEntity(
    teachingEntity: TeachingEntity
  ): teachingEntity is ExerciseEntity {
    return (teachingEntity as ExerciseEntity).kind === TEACHING_ENUM.Exercise;
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
    const currentTeachingEntityId = this.teachingEntities[this.currentPos].id;
    this.goToStartOfSection(currentTeachingEntityId, true);
    this.onBottomNavigationCommon();
  }
  onNext() {
    this.incrementCurrentPos();
    //this.addWordToContents();
    //this.updateActiveWord();
    this.onBottomNavigationCommon();
  }
  onNextSection() {
    const currentSlideEntityId = this.teachingEntities[this.currentPos].id;
    this.goToStartOfSection(currentSlideEntityId);
    this.onBottomNavigationCommon();
  }

  //methods to be called on every bottom navigation method
  private onBottomNavigationCommon() {
    this.displayedContentInSlide &&
      this.setTeachingEntityAsVisited(this.displayedContentInSlide);
    this.updateWordEntitiesToBeShownOnSidebar();
    this.runUpdateActiveWordsOnSidebar = true;
    this.autoExpandSection();
  }

  //If the sidebar Vocabulary panel is expanded, all the word items show if showContentAfterWordVisited
  //is true. If the user sets this to false, the words only appear on the sidebar, when they have been
  //visited even if the Vocabulary panel is expanded. This function ensures the correct words are shown
  //on the sidebar.
  private updateWordEntitiesToBeShownOnSidebar() {
    const wordEntityIdsToShow = this.wordEntities
      .filter((wordEntity, i) => {
        const shouldShow = this.isWordEntityToBeShown(wordEntity, i);
        return shouldShow;
      })
      .map((wordEntity) => wordEntity.id);
    const wordEntityIdsToShowSet = new Set(wordEntityIdsToShow);
    this.vocabMenuItemsToShow = this.vocabSidebarMenuItems?.filter(
      (menuItem: MenuItem) => {
        if (menuItem.id) {
          return wordEntityIdsToShowSet.has(menuItem.id);
        }
        return false;
      }
    );

    this.vocabSection && (this.vocabSection.items = this.vocabMenuItemsToShow);
    //Need to change the object reference or Angular does not re-render.
    //To do: Are there any better ways to trigger the re-render?
    this.sidebarMenuItems = [...this.sidebarMenuItems];
  }

  //The default behaviour is for the sections on the sidebar
  //to expand when a slide of that section is visited. However,
  //the user can override this by opening/closing the section. In this case, the user's preference is honoured.
  private autoExpandSection() {
    if (
      this.displayedContentInSlide?.kind === TEACHING_ENUM.Word &&
      !this.autoExpandVocabulary &&
      this.wantsVocabularyExpanded === null
    ) {
      this.autoExpandVocabulary = true;
      const isVocabularyExpanded = this.decideIfVocabularyExpanded();
      this.vocabSection && (this.vocabSection.expanded = isVocabularyExpanded);
    }
    if (
      this.displayedContentInSlide?.kind === TEACHING_ENUM.Summary &&
      !this.autoExpandSummary &&
      this.wantsSummaryExpanded === null
    ) {
      this.autoExpandSummary = true;
      const isSummaryExpanded = this.decideIfSummaryExpanded();
      this.summarySection && (this.summarySection.expanded = isSummaryExpanded);
    }
    if (
      this.displayedContentInSlide?.kind === TEACHING_ENUM.Exercise &&
      !this.autoExpandExercises &&
      this.wantsExercisesExpanded === null
    ) {
      this.autoExpandExercises = true;
      const isExercisesExpanded = this.decideIfExercisesExpanded();
      this.exerciseSection &&
        (this.exerciseSection.expanded = isExercisesExpanded);
    }

    //Not needed here but is needed in updateWordItemsToBeShownOnSidebar.
    //To do: Find out the reason. Keep it for now.
    this.sidebarMenuItems = [...this.sidebarMenuItems];
  }

  private updateWantsExpanded(event: MenuItemCommandEvent) {
    //find out expanded state of clicked on section
    let expandSection;
    if (event?.item?.expanded !== undefined && event?.item?.expanded !== null) {
      expandSection = event.item.expanded;
    } else {
      return;
    }

    //get expanded state of all sections
    const expandedStates = new Map();
    this.sidebarMenuItems.forEach((menuItem) => {
      expandedStates.set(menuItem.label, menuItem.expanded);
    });

    //if selected section is open update wantsExpanded of selected section to false.
    if (!expandSection) {
      //Also update wantsExpanded of all closed sections to false.
      this.sidebarMenuItems.forEach((menuItem) => {
        let expanded = expandedStates.get(menuItem.label);
        if (!expanded) {
          if (menuItem.id === TEACHING_ENUM.Word) {
            this.wantsVocabularyExpanded = false;
          }
          if (menuItem.id === TEACHING_ENUM.Summary) {
            this.wantsSummaryExpanded = false;
          }
          if (menuItem.id === TEACHING_ENUM.Exercise) {
            this.wantsExercisesExpanded = false;
          }
        }
      });
    } else {
      //if selected section is open, update wantsExpanded to true for only the selected section
      if (event.item.id === TEACHING_ENUM.Word) {
        this.wantsVocabularyExpanded = true;
      }
      if (event.item.id === TEACHING_ENUM.Summary) {
        this.wantsSummaryExpanded = true;
      }
      if (event.item.id === TEACHING_ENUM.Exercise) {
        this.wantsExercisesExpanded = true;
      }
    }
  }

  private getTeachingEntityById(id: string) {
    const teachingEntity = this.teachingEntities.find(
      (teachingEntity) => teachingEntity.id === id
    );
    return teachingEntity;
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
    if (this.displayedContentInSlide) {
      const newActiveWordContainer = this.injectedDocument.querySelector(
        '.' + this.displayedContentInSlide.id
      );

      //remove class from all possible places
      const wordElements = Array.from(
        this.injectedDocument.querySelectorAll("[class*='word']")
      );
      const summaryElements = Array.from(
        this.injectedDocument.querySelectorAll("[class*='summary']")
      );
      const exerciseElements = Array.from(
        this.injectedDocument.querySelectorAll("[class*='exercise']")
      );
      const sidebarElements = [
        ...wordElements,
        ...summaryElements,
        ...exerciseElements,
      ];

      sidebarElements.forEach((sidebarElement) => {
        sidebarElement.classList.remove('active-word');
        sidebarElement.classList.remove('active-summary');
        sidebarElement.classList.remove('active-exercise');
      });

      if (this.isWordEntity(this.displayedContentInSlide)) {
        newActiveWordContainer?.classList.add('active-word');
      }
      if (this.isSummaryEntity(this.displayedContentInSlide)) {
        newActiveWordContainer?.classList.add('active-summary');
      }
      if (this.isExerciseEntity(this.displayedContentInSlide)) {
        newActiveWordContainer?.classList.add('active-exercise');
      }
    }

    this.runUpdateActiveWordsOnSidebar = false;
  }

  private generateTeachingEntities() {
    this.wordsSubscription$ = this.wordService
      .getWordEntities()
      .subscribe((wordEntities: WordEntity[]) => {
        this.wordEntities = wordEntities;
      });

    this.summaryEntities = this.generateSummaryEntities(
      this.maxWordsOnSummarySlide,
      this.wordEntities
    );

    this.teachingEntities = [
      ...this.wordEntities,
      ...this.summaryEntities,
      ...this.exerciseEntities,
    ];
  }

  private prepareSideBarMenuItems() {
    this.vocabSidebarMenuItems = this.generateSidebarMenuItems(
      this.wordEntities,
      (e) => {
        this.updateDisplayedContent(e);
      }
    );
    this.vocabMenuItemsToShow = [...this.vocabSidebarMenuItems];

    this.summarySidebarMenuItems = this.generateSidebarMenuItems(
      this.summaryEntities,
      (e) => {
        this.updateDisplayedContent(e);
      }
    );

    this.exerciseSidebarMenuItems = this.generateSidebarMenuItems(
      this.exerciseEntities,
      (e) => {
        this.updateDisplayedContent(e);
      }
    );
  }

  private generateSideBarMenuItems() {
    const isVocabularyExpanded = this.decideIfVocabularyExpanded();
    const isSummaryExpanded = this.decideIfSummaryExpanded();
    const isExercisesExpanded = this.decideIfExercisesExpanded();

    this.vocabSection = {
      label: 'Vocabulary',
      id: TEACHING_ENUM.Word,
      //icon: 'pi pi-bolt',
      icon: 'bi bi-record-fill',
      expanded: isVocabularyExpanded,
      command: (e: MenuItemCommandEvent) => {
        this.updateWantsExpanded(e);
      },
      items: this.vocabMenuItemsToShow,
    };

    this.summarySection = {
      label: 'Summary',
      id: TEACHING_ENUM.Summary,
      icon: 'bi bi-record-fill',
      expanded: isSummaryExpanded,
      command: (e: MenuItemCommandEvent) => {
        this.updateWantsExpanded(e);
      },
      items: this.summarySidebarMenuItems,
    };

    this.exerciseSection = {
      label: 'Exercises',
      id: TEACHING_ENUM.Exercise,
      icon: 'bi bi-record-fill',
      expanded: isExercisesExpanded,
      command: (e: MenuItemCommandEvent) => {
        this.updateWantsExpanded(e);
      },
      items: this.exerciseSidebarMenuItems,
    };

    const generatedContents = [
      this.vocabSection,
      this.summarySection,
      this.exerciseSection,
    ];

    this.runUpdateActiveWordsOnSidebar = true;

    return generatedContents;
  }

  private isWordEntityToBeShown(
    teachingEntity: TeachingEntity,
    index: number
  ): boolean {
    if (
      index !== 0 &&
      this.showContentAfterWordVisited &&
      this.isWordEntity(teachingEntity) &&
      !teachingEntity.isVisited
    ) {
      return false;
    } else {
      return true;
    }
  }

  private generateSidebarMenuItems(
    teachingEntities: TeachingEntity[],
    callback: (...args: any[]) => void,
    label?: string
  ): any {
    let count = 1;
    let newLabel = '';
    let itemClass = '';
    const sidebarMenuItems: MenuItem[] = teachingEntities

      .filter((teachingEntity, i) => {
        //don't show vocab word until it has been visited if showContentAfterWordVisited is true
        return this.isWordEntityToBeShown(teachingEntity, i);
      })

      .map((teachingEntity) => {
        if (label === undefined) {
          if (this.isWordEntity(teachingEntity)) {
            newLabel = this.showPrimaryWordFirst
              ? capitalize(teachingEntity.english)
              : capitalize(teachingEntity.spanish);
            itemClass = 'word ' + teachingEntity.id;
          }
          if (this.isSummaryEntity(teachingEntity)) {
            newLabel = capitalize(teachingEntity.kind) + ' ' + count++;
            itemClass = 'summary ' + teachingEntity.id;
          }
          if (this.isExerciseEntity(teachingEntity)) {
            newLabel = capitalize(teachingEntity.kind) + ' ' + count++;
            itemClass = 'exercise ' + teachingEntity.id;
          }
        }

        const newSidebarMenuItem = {
          label: newLabel,
          styleClass: itemClass,
          icon: 'bi bi-record2',
          id: teachingEntity.id,
          command: callback,
        };

        return newSidebarMenuItem;
      });

    return sidebarMenuItems;
  }

  private generateSummaryEntities(
    maxWordsPerPage: number,
    wordEntities: WordEntity[]
  ): SummaryEntity[] {
    if (maxWordsPerPage < 1) {
      return [];
    }

    let count = 1;
    const type = TEACHING_ENUM.Summary;
    const summaryEntities: SummaryEntity[] = [];

    let summaryEntity: SummaryEntity = {
      id: 'summary-',
      kind: type,
      wordEntities: [],
      isVisited: false,
    };

    wordEntities.forEach((wordEntity, i, arr) => {
      summaryEntity.id = 'summary-' + count;
      //continue adding wordEntities to wordEntitiesrray on object until wordsPerPage = maxWordsPerPage ;
      summaryEntity.wordEntities.push(wordEntity);

      //if last iteration, add the remaining summaryEntity and end loop early
      if (i === arr.length - 1) {
        summaryEntities.push(summaryEntity);
        return;
      }

      if ((i + 1) % maxWordsPerPage === 0) {
        //when the wordsPerPage limit is reached, we add the summaryEntity to main summaryEntities array
        summaryEntities.push(summaryEntity);
        count++;

        summaryEntity = {
          id: 'summary-',
          kind: type,
          wordEntities: [],
          isVisited: false,
        };
      }
    });

    return summaryEntities;
  }

  private setTeachingEntityAsVisited(teachingEntity: TeachingEntity) {
    teachingEntity.isVisited = true;
  }

  //Navigates to start of next section if goToPrevious argument is not provided or set to false. Set goToPrevious to true to navigate to start of previous section.
  private goToStartOfSection(
    currentSlideEntityId: string,
    goToPrevious?: boolean
  ): void {
    let idNextSection: string;

    if (goToPrevious) {
      idNextSection =
        this.getIdOfPreviousTeachingSectionStart(currentSlideEntityId);
    } else {
      idNextSection =
        this.getIdOfNextTeachingSectionStart(currentSlideEntityId);
    }

    const indexNextSection = this.teachingEntities.findIndex(
      (teachingEntity) => teachingEntity.id === idNextSection
    );

    this.currentPos = indexNextSection;

    this.displayedContentInSlide = this.teachingEntities[this.currentPos];
  }

  private getIdOfPreviousTeachingSectionStart(
    currentSlideEntityId: string
  ): string {
    //get the part of the id that comes before the last hyphen. This part of the id represents the section.
    const currentTeachingSection = currentSlideEntityId.substring(
      0,
      currentSlideEntityId.lastIndexOf('-')
    );
    let previousTeachingSection: string = currentTeachingSection;
    let idOfPreviousTeachingSectionStart = currentSlideEntityId;
    let isInPreviousTeachingSection = false;

    //only iterate back from the current position in the array
    const filteredTeachingEntities = this.teachingEntities.slice(
      0,
      this.currentPos + 1
    );

    for (let i = filteredTeachingEntities.length - 1; i >= 0; i--) {
      let teachingEntityId = filteredTeachingEntities[i].id;
      //if is the first slide, return the id for the first slide
      if (i === 0) {
        return teachingEntityId;
      }

      //get the part of the id that comes before the last hyphen. This part of the id represents the section.
      const teachingSection = teachingEntityId.substring(
        0,
        teachingEntityId.lastIndexOf('-')
      );
      console.log('itemSection ' + teachingSection);

      if (isInPreviousTeachingSection) {
        //if section changes a second time, return the id of the next slide
        if (teachingSection !== previousTeachingSection) {
          idOfPreviousTeachingSectionStart = filteredTeachingEntities[i + 1].id;
          return idOfPreviousTeachingSectionStart;
        }
      }

      if (
        teachingSection !== currentTeachingSection &&
        !isInPreviousTeachingSection
      ) {
        previousTeachingSection = teachingSection; //e.g. previousSection = 'word'
        isInPreviousTeachingSection = true;
      }
    }
    return idOfPreviousTeachingSectionStart;
  }

  private getIdOfNextTeachingSectionStart(
    currentSlideEntityId: string
  ): string {
    //get the part of the id that comes before the last hyphen. This part of the id represents the section.
    const currentTeachingSection = currentSlideEntityId.substring(
      0,
      currentSlideEntityId.lastIndexOf('-')
    );

    //only iterate forward from the current position in the array
    const filteredTeachingEntities = this.teachingEntities.slice(
      this.currentPos
    );

    for (let i = 0; i < filteredTeachingEntities.length; i++) {
      let teachingEntityId = filteredTeachingEntities[i].id;
      //get the part of the id that comes before the last hyphen. This part of the id represents the section.
      let teachingSection = teachingEntityId.substring(
        0,
        teachingEntityId.lastIndexOf('-')
      );

      if (teachingSection !== currentTeachingSection) {
        return teachingEntityId;
      }
    }
    return currentSlideEntityId;
  }

  private decrementCurrentPos() {
    if (this.currentPos - 1 < 0) {
      return;
    }
    this.displayedContentInSlide = this.teachingEntities[--this.currentPos];
  }

  private incrementCurrentPos() {
    if (this.sidebarMenuItems) {
      if (this.currentPos + 1 > this.teachingEntities.length - 1) {
        return;
      }
      this.displayedContentInSlide = this.teachingEntities[++this.currentPos];
    }
  }

  private goToStart() {
    this.currentPos = 0;
    this.displayedContentInSlide = this.teachingEntities[this.currentPos];
  }
  private goToEnd() {
    this.currentPos = this.teachingEntities.length - 1;
    this.displayedContentInSlide = this.teachingEntities[this.currentPos];
  }

  private updateDisplayedContent(event: MenuItemCommandEvent) {
    if (event?.item?.id) {
      const id = event.item.id;
      const newDisplayedContent = this.teachingEntities.find(
        (itemDetails) => id === itemDetails.id
      );

      if (newDisplayedContent) {
        this.displayedContentInSlide = newDisplayedContent;

        this.currentPos = this.teachingEntities.findIndex(
          (teachingEntity) =>
            teachingEntity.id === this.displayedContentInSlide!.id
        );

        this.setTeachingEntityAsVisited(this.displayedContentInSlide);
        this.runUpdateActiveWordsOnSidebar = true;
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
