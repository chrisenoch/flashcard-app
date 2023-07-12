import { Component } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { WordDetails } from '../models/wordDetails';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  contentItems: MenuItem[] = [];
  navItems: MenuItem[] | undefined;
  displayedContent: WordDetails | undefined;
  currentPos = 0;

  //this only cheecks items one-level deep
  getNumOfContentItems() {
    let count = 0;
    this.contentItems.forEach((item) => {
      if (item.items) {
        count += item.items?.length;
      }
    });
    return count;
  }

  ngOnInit() {
    //init first word
    this.displayedContent = this.wordDetails[this.currentPos];
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
            command: (e) => {
              this.updateDisplayedContent(e);
            },
          },
          // {
          //   label: 'Lamp',
          //   id: 'word-4',
          // },
          // {
          //   label: 'Bookcase',
          //   id: 'word-5',
          // },
          // {
          //   label: 'Sofa',
          //   id: 'word-6',
          // },
          // {
          //   label: 'Rug',
          //   id: 'word-7',
          // },
          // {
          //   label: 'Desk',
          //   id: 'word-8',
          // },
          // {
          //   label: 'Bedside table',
          //   id: 'word-9',
          // },
          // {
          //   label: 'Curtains',
          //   id: 'word-10',
          // },
          // {
          //   label: 'Wardrobe',
          //   id: 'word-11',
          // },
          // {
          //   label: 'Toilet',
          //   id: 'word-12',
          // },
          // {
          //   label: 'Sink',
          //   id: 'word-13',
          // },
          // {
          //   label: 'Mirror',
          //   id: 'word-14',
          // },
          // {
          //   label: 'Bath',
          //   id: 'word-15',
          // },
          // {
          //   label: 'Shower',
          //   id: 'word-16',
          // },
        ],
      },
      {
        label: 'Summary',
        // items: [
        //   {
        //     label: 'Vocabulary',
        //   },
        // ],
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
        command: (e) => {
          this.showMessage(e);
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

  decrementCurrentPos() {
    if (this.currentPos - 1 < 0) {
      return;
    }
    this.displayedContent = this.wordDetails[--this.currentPos];
  }

  incrementCurrentPos() {
    if (this.contentItems) {
      if (this.currentPos + 1 > this.getNumOfContentItems() - 1) {
        return;
      }
      this.displayedContent = this.wordDetails[++this.currentPos];
      console.log(this.currentPos);
    }
  }

  goToStart() {
    this.currentPos = 0;
    this.displayedContent = this.wordDetails[this.currentPos];
  }
  goToEnd() {
    this.currentPos = this.wordDetails.length - 1;
    this.displayedContent = this.wordDetails[this.currentPos];
  }

  //get these from service later
  //words for now, but this may include other objects later
  wordDetails: WordDetails[] = [
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

  //test PrimeNg command property
  showMessage(e: any) {
    console.log('hello');
    console.log({ e });
  }

  updateDisplayedContent(e: MenuItemCommandEvent) {
    if (e?.item?.id) {
      const id = e.item.id;
      const newDisplayedContent = this.wordDetails.find(
        (wordDetails) => id === wordDetails.id
      );

      if (newDisplayedContent) {
        this.displayedContent = newDisplayedContent;

        this.currentPos = this.wordDetails.findIndex(
          (ele) => ele.id === this.displayedContent!.id
        );
      }
    }
  }
}
