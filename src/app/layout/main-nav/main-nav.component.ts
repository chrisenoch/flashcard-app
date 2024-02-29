import { Component } from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
  navItems = [
    { name: 'Still to do', href: '#' },
    { name: 'Still to do', href: '#' },
    { name: 'Still to do', href: '#' },
  ];
}
