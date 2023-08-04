import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}
  close$ = new Subject<Event | null>();

  onClose(e: Event) {
    this.close$.next(e);
  }
}
