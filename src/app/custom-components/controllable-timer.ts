import { Observable, interval, tap, map, takeWhile, finalize } from 'rxjs';
import { ControlledError } from './errors/ControlledError';
import { controlledTimer } from '../models/interfaces/controlledTimer';

export function controllableTimer(timeInMS: number): {
  sub: Observable<number>;
  isActive: boolean;
  count: number;
  pauseTimer: boolean;
  cancelTimer: boolean;
} {
  let repetitions = Math.round(timeInMS / 100);
  //object needed so can change these values with this return object from outside this function via a closure.
  let controlObj: {
    sub: Observable<number>;
    isActive: boolean;
    count: number;
    pauseTimer: boolean;
    cancelTimer: boolean;
  } = {
    sub: new Observable(),
    isActive: false,
    count: 0,
    pauseTimer: false,
    cancelTimer: false,
  };

  controlObj.sub = interval(100).pipe(
    tap(() => {
      if (controlObj.count === 0) {
        controlObj.isActive = true;
      }
    }),
    map(() => {
      if (controlObj.pauseTimer) {
        return controlObj.count;
      } else {
        return ++controlObj.count;
      }
    }),
    map((val) => {
      if (controlObj.cancelTimer) {
        controlObj.count = 0;
        controlObj.isActive = false;
        throw new ControlledError(
          'Observable cancelled because cancelTimer set to true'
        );
      } else {
        return val;
      }
    }),

    takeWhile((val) => val <= repetitions),
    finalize(() => {
      controlObj.isActive = false;
      controlObj.count = 0;
      controlObj.pauseTimer = false;
      controlObj.cancelTimer = false;
    })
  );

  return controlObj;
}

export function cancelTimers(timers: (controlledTimer | undefined)[]) {
  timers.forEach((timer) => {
    if (timer !== undefined && timer !== null) {
      timer.cancelTimer = true;
    }
  });
}

export function pauseTimers(
  timers: (controlledTimer | undefined)[],
  isPaused: boolean
) {
  timers.forEach((timer) => {
    if (timer !== undefined && timer !== null) {
      timer.pauseTimer = isPaused;
    }
  });
}
