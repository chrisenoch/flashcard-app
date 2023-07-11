import { Component } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  contentItems: MenuItem[] | undefined;
  navItems: MenuItem[] | undefined;

  showMessage(e: any) {
    console.log('hello');
    console.log({ e });
  }

  ngOnInit() {
    this.contentItems = [
      {
        label: 'Vocabulary',
        expanded: true,
        items: [
          {
            label: 'Table',
          },
          {
            label: 'Chair',
          },
          {
            label: 'Door',
          },
          {
            label: 'Lamp',
          },
          {
            label: 'Bookcase',
          },
          {
            label: 'Sofa',
          },
          {
            label: 'Rug',
          },
          {
            label: 'Desk',
          },
          {
            label: 'Bedside table',
          },
          {
            label: 'Curtains',
          },
          {
            label: 'Wardrobe',
          },
          {
            label: 'Toilet',
          },
          {
            label: 'Sink',
          },
          {
            label: 'Mirror',
          },
          {
            label: 'Bath',
          },
          {
            label: 'Shower',
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
