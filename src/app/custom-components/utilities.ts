export function compareDOMRectValues(
  DOMRectFirst: DOMRect,
  DOMRectSecond: DOMRect
) {
  //DOMRect properties are not enumerable so we cannot loop over them with "for in" or Object.entries#. Also,
  //getOwnpropertyNames# does not work because the DOMRect properties are inherited from DOMRectReadOnly https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
  const { x, y, width, height, top, right, bottom, left } = DOMRectFirst;
  const {
    x: x2,
    y: y2,
    width: width2,
    height: height2,
    top: top2,
    right: right2,
    bottom: bottom2,
    left: left2,
  } = DOMRectSecond;

  if (
    x !== x2 ||
    y !== y2 ||
    width !== width2 ||
    height !== height2 ||
    top !== top2 ||
    right !== right2 ||
    bottom !== bottom2 ||
    left !== left2
  ) {
    return false;
  } else {
    return true;
  }
}
