import { Component, OnInit } from '@angular/core';
import { LocalStorageId } from 'src/app/models/types/localStorageId';
import { LocalStorageService } from 'src/app/storage/local-storage.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
  constructor(private localStorageService: LocalStorageService) {
    console.log('in nav constructor');
  }
  show = true;
  alertStatus: any = undefined;
  alertId: LocalStorageId = 'explanation-of-app-1709991594775';

  ngOnInit(): void {
    const alertStatus = this.localStorageService.fetch(this.alertId);
    if (alertStatus == null) {
      this.show = true;
    } else if (alertStatus === 'hasShown') {
      this.show = false;
    }
  }

  closeAlert() {
    this.localStorageService.store(this.alertId, 'hasShown');
    this.show = false;
  }

  navItems = [
    { name: 'Still to do', href: '#' },
    { name: 'Still to do', href: '#' },
  ];
}
