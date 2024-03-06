import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonService {
  constructor() {}
  mode$ = new Subject<string>();

  updateMode(mode: string) {
    this.mode$.next(mode);
  }
}
