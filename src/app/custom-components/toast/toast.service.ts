import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}
  close$ = new Subject<{ event: Event; toastId: string } | null>();
  closeAll$ = new Subject<Event | null>();
  closeAllOthers$ = new Subject<{ event: Event; toastId: string } | null>();
  closeAllInGroup$ = new Subject<{
    event: Event;
    toastGroupId: string;
  } | null>();

  closeAllOthersInGroup$ = new Subject<{
    event: Event;
    toastId: string;
    toastGroupId: string;
  } | null>();

  showAll$ = new Subject<Event | null>();

  showAllOthersInGroup$ = new Subject<{
    event: Event;
    toastId: string;
    toastGroupId: string;
  } | null>();

  onCloseAll(e: Event) {
    this.closeAll$.next(e);
  }

  onCloseAllOthers(e: Event, toastId: string) {
    this.closeAllOthers$.next({ event: e, toastId });
  }

  onCloseAllInGroup(e: Event, toastGroupId: string) {
    this.closeAllInGroup$.next({ event: e, toastGroupId });
  }

  onCloseAllOthersInGroup(e: Event, toastId: string, toastGroupId: string) {
    this.closeAllOthersInGroup$.next({ event: e, toastId, toastGroupId });
  }

  onShowAllOthersInGroup(e: Event, toastId: string, toastGroupId: string) {
    this.showAllOthersInGroup$.next({ event: e, toastId, toastGroupId });
  }

  onClose(e: Event, toastId: string) {
    this.close$.next({ event: e, toastId });
  }

  onShowAll(e: Event) {
    this.showAll$.next(e);
  }
}
