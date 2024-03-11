import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalComponentFunctionsService {
  constructor() {}
  mode$ = new Subject<string>();
  updateMode(mode: string) {
    this.mode$.next(mode);
  }
}
