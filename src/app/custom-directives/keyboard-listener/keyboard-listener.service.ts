import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RelevantKeyboardEvent } from 'src/app/models/types/relevantKeyboardEvent';

@Injectable({
  providedIn: 'root',
})
export class KeyboardListenerService {
  constructor() {}
  keyboardEvent$ = new Subject<RelevantKeyboardEvent>();
}
