import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}
  closeAll$ = new Subject<Event | null>();
  closeAllInGroup$ = new Subject<{
    event: Event;
    toastGroupId: string;
  } | null>();
  showAll$ = new Subject<Event | null>();
  close$ = new Subject<{ event: Event; toastId: string } | null>();

  onCloseAll(e: Event) {
    this.closeAll$.next(e);
  }

  onCloseAllInGroup(e: Event, toastGroupId: string) {
    this.closeAllInGroup$.next({ event: e, toastGroupId });
  }

  onClose(e: Event, toastId: string) {
    this.close$.next({ event: e, toastId });
  }

  onShowAll(e: Event) {
    this.showAll$.next(e);
  }
}
