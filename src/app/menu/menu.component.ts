import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Vocabulary',
        icon: 'pi pi-fw pi-file',
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
  }
}
