import { Component, Input } from '@angular/core';
import { LocalStorageId } from 'src/app/models/types/localStorageId';
import { LocalStorageService } from 'src/app/storage/local-storage.service';

@Component({
  selector: 'app-removable-alert',
  templateUrl: './removable-alert.component.html',
  styleUrls: ['./removable-alert.component.scss'],
})
export class RemovableAlertComponent {
  constructor(private localStorageService: LocalStorageService) {}
  @Input({ required: true }) alertId!: LocalStorageId;
  show = true;
  alertStatus: any = undefined;

  ngOnInit(): void {
    const alertStatus = this.localStorageService.fetch(this.alertId);
    if (alertStatus == null) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  closeAlert() {
    this.localStorageService.store(this.alertId, 'hasShown');
    this.show = false;
  }
}
