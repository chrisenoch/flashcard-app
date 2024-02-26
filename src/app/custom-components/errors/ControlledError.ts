//Should be avoided if possible. This class is for when errors are thrown as part of the programming logic. A use case is below:
//We have ControllableTimer, which is implemented using RxJS and can be cancelled deliberately at any time.
//If cancel is explicitly called from outside, then the timer has NOT completed.
//Reacting to the cancelled call in the 'complete' callback of 'subscribe' is confusing, counter-intuitive and error-prone. Consequently, when cancel is called from outside
//ControllableTimer, a deliberate error is thrown inside ControllableTimer. You can see ControllableTimer for an example of this.

export class ControlledError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
