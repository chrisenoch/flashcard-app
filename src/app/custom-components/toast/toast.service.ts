import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
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

  //show$ Can be called from outside the toast component.
  show$ = new Subject<{ event: Event; toastId: string } | null>();
  showAll$ = new Subject<{ event: Event; toastId: string } | null>();

  showAllOthersInGroup$ = new Subject<{
    event: Event;
    toastId: string;
    toastGroupId: string;
  } | null>();

  goToNextId$ = new Subject<Event | null>();
  goToPreviousId$ = new Subject<Event | null>();
  goToFirstId$ = new Subject<Event | null>();
  goToLastId$ = new Subject<Event | null>();

  accountForOverflowXContentPushingContent$ = new Subject<boolean>();
  newBodyOverflowX$ = new Subject<number>();
  bodyOverflowX: number | undefined;

  updateBodyOverflowX(newBodyOverflowX: number) {
    if (this.bodyOverflowX !== newBodyOverflowX) {
      this.newBodyOverflowX$.next(newBodyOverflowX);
      this.bodyOverflowX = newBodyOverflowX;
    }
  }

  runAccountForOverflowXContentPushingContent$() {
    this.accountForOverflowXContentPushingContent$.next(true);
  }

  onGoToNextId(e: Event) {
    this.goToNextId$.next(e);
  }
  onGoToPreviousId(e: Event) {
    this.goToPreviousId$.next(e);
  }

  onGoToFirstId(e: Event) {
    this.goToFirstId$.next(e);
  }

  onGoToLastId(e: Event) {
    this.goToLastId$.next(e);
  }

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

  onShow(e: Event, toastId: string) {
    this.show$.next({ event: e, toastId });
  }

  onShowAll(e: Event, toastId: string) {
    this.showAll$.next({ event: e, toastId });
  }
}
