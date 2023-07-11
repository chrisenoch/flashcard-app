import { Component } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { WordDetails } from '../models/wordDetails';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  contentItems: MenuItem[] | undefined;
  navItems: MenuItem[] | undefined;
  displayedContent: WordDetails | undefined;

  //get these from service later
  //words for now, but this may include other objects later
  wordDetails: WordDetails[] = [
    {
      id: 'word-1',
      english: 'Table',
      spanish: 'La mesa',
      explanation: 'Some table explanation here',
    },
    {
      id: 'word-2',
      english: 'Chair',
      spanish: 'La silla',
      explanation: 'Some chair explanation here',
    },
  ];

  //test PrimeNg command property
  showMessage(e: any) {
    console.log('hello');
    console.log({ e });
  }

  updateDisplayedContent(e: MenuItemCommandEvent) {
    console.log('hi');
    if (e?.item?.id) {
      console.log('hi hi');
      const id = e.item.id;
      const newDisplayedContent = this.wordDetails.find(
        (wordDetails) => id === wordDetails.id
      );
      //console.log(newDisplayedContent);

      if (newDisplayedContent) {
        this.displayedContent = newDisplayedContent;
      }
      console.log(this.displayedContent);
    }
  }

  ngOnInit() {
    //init first word
    this.displayedContent = this.wordDetails[0];
    console.log(this.displayedContent);

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
          },
          {
            label: 'Lamp',
            id: 'word-4',
          },
          {
            label: 'Bookcase',
            id: 'word-5',
          },
          {
            label: 'Sofa',
            id: 'word-6',
          },
          {
            label: 'Rug',
            id: 'word-7',
          },
          {
            label: 'Desk',
            id: 'word-8',
          },
          {
            label: 'Bedside table',
            id: 'word-9',
          },
          {
            label: 'Curtains',
            id: 'word-10',
          },
          {
            label: 'Wardrobe',
            id: 'word-11',
          },
          {
            label: 'Toilet',
            id: 'word-12',
          },
          {
            label: 'Sink',
            id: 'word-13',
          },
          {
            label: 'Mirror',
            id: 'word-14',
          },
          {
            label: 'Bath',
            id: 'word-15',
          },
          {
            label: 'Shower',
            id: 'word-16',
          },
        ],
      },
      {
        label: 'Summary',
        items: [
          {
            label: 'Vocabulary',
          },
        ],
      },
      {
        label: 'Exercises',
        items: [
          {
            label: 'Exercise 1',
          },
          {
            label: 'Exercise 2',
          },
          {
            label: 'Exercise 3',
          },
        ],
      },
    ];

    this.navItems = [
      {
        label: 'Start',
        command: (e) => {
          this.showMessage(e);
        },
        id: 'fun-value',
        state: {
          department: 'HR',
          position: 'manager',
        },
      },
      {
        label: 'Previous',
      },
      {
        label: 'Next',
      },
      {
        label: 'End',
      },
      {
        label: 'Toggle',
      },
      {
        icon: 'pi-bars',
      },
    ];
  }
}
