import { Component, OnInit } from '@angular/core';
import { LocalStorageId } from 'src/app/models/types/localStorageId';
import { LocalStorageService } from 'src/app/storage/local-storage.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
  navItems = [{ name: 'Still to do', href: '#' }];
}
