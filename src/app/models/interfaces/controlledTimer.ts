import { Observable } from 'rxjs';

export interface controlledTimer {
  sub: Observable<number>;
  isActive: boolean;
  count: number;
  pauseTimer: boolean;
  cancelTimer: boolean;
}
