export type UpdateShowState = {
  display: 'inline-block' | 'none';
  isShowing: boolean;
  keepShowing: boolean;
  [key: string]: any;
};

//KeepShowing should not have a setter. Upon initialisation and window resize display must not be set to none even if show is set to false. Visibility:hidden is needed in order to calculate the coordinates of the toast in defineCoords()
export function updateShowState(
  thisOfResidingClass: UpdateShowState,
  isShow: boolean
) {
  const self = thisOfResidingClass;
  if (isShow) {
    //Don't set keepShowing to false here. Upon hover out, the tooltip should not continue showing unless KeepShowing is set to true.
    self.display = 'inline-block';
    self.isShowing = true;
  } else {
    self.display = 'none';
    self.isShowing = false;
    self.keepShowing = false;
  }
}
