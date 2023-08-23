import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElementControlsService {
  constructor() {}

  close$ = new Subject<{ event: Event; elementId: string } | null>();
  closeAll$ = new Subject<Event | null>();
  closeAllOthers$ = new Subject<{ event: Event; elementId: string } | null>();
  closeAllInGroup$ = new Subject<{
    event: Event;
    elementGroupId: string;
  } | null>();

  closeAllOthersInGroup$ = new Subject<{
    event: Event;
    elementId: string;
    elementGroupId: string;
  } | null>();

  //show$ Can be called from outside the element component.
  show$ = new Subject<{ event: Event; elementId: string } | null>();
  showAll$ = new Subject<Event | null>();

  showAllOthersInGroup$ = new Subject<{
    event: Event;
    elementId: string;
    elementGroupId: string;
  } | null>();

  goToNextId$ = new Subject<Event | null>();
  goToPreviousId$ = new Subject<Event | null>();
  goToFirstId$ = new Subject<Event | null>();
  goToLastId$ = new Subject<Event | null>();

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

  onCloseAllOthers(e: Event, elementId: string) {
    this.closeAllOthers$.next({ event: e, elementId });
  }

  onCloseAllInGroup(e: Event, elementGroupId: string) {
    this.closeAllInGroup$.next({ event: e, elementGroupId: elementGroupId });
  }

  onCloseAllOthersInGroup(e: Event, elementId: string, elementGroupId: string) {
    this.closeAllOthersInGroup$.next({ event: e, elementId, elementGroupId });
  }

  onShowAllOthersInGroup(e: Event, elementId: string, elementGroupId: string) {
    this.showAllOthersInGroup$.next({ event: e, elementId, elementGroupId });
  }

  onClose(e: Event, elementId: string) {
    this.close$.next({ event: e, elementId: elementId });
  }

  onShow(e: Event, elementId: string) {
    this.show$.next({ event: e, elementId });
  }

  onShowAll(e: Event) {
    this.showAll$.next(e);
  }
}
