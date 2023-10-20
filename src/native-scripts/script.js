import { colord } from "colord";
console.log("in scrssipt.js");

//Elements
const canvas1 = document.getElementById('canvas-1');
const rotatePointerContainerClockwiseBtn = document.getElementById('rotatePointerContainerClockwise');
const rotatePointerContainerAntiClockwiseBtn = document.getElementById('rotatePointerContainerAntiClockwise');
const colorPlotterRotator1 = document.querySelector('.color-plotter-rotator-1');
const colorPlotterMarker1 = document.querySelector('.color-plotter-marker-1');
const colorOverlay1 = document.querySelector('.color-wheel-overlay-1');
const addPointer = document.getElementById('add-pointer');
const circleDetails = document.getElementById('circle-details-container');

let activePointerId = 'pointer-1';
const pointerIdsAndDetails = new Map();
let nextId = 0;


//Pointers
let hsvPlottedColorArr1 = [235, 76, 100];
const pointerContainer1 = document.getElementById('pointer-container-1');

//App
const img1 = new Image();
img1.crossOrigin = 'anonymous';
img1.src = './assets/my_colour_wheel_100_new.png';
const ctx1 = canvas1.getContext('2d');
img1.addEventListener('load', () => {
  ctx1.drawImage(img1, 0, 0);
  img1.style.display = 'none';
});


function createPointer() {
  nextId++;

  const pointer = document.createElement('div');
  pointer.textContent = nextId;
  pointer.id = `pointer-${nextId}`;
  pointer.classList.add('pointer'
    , 'align-items-center', 'justify-content-center', 'flex');

  //create selected-color-box
  const selectedColorBox = document.createElement('div');
  selectedColorBox.classList.add('color-cell');
  selectedColorBox.id = `selected-color-${nextId}`;

  //create form element
  const form = document.createElement('form');
  form.id = `plot-color-${nextId}`;
  form.classList.add('flex', 'flex-col', 'gap-4', 'bg-light-blue');
  const label = document.createElement('label');
  const att = document.createAttribute("for");
  att.value = `color-code-${nextId}`;
  label.setAttributeNode(att);
  label.textContent = 'Color code';
  const span = document.createElement('span');
  span.textContent = 'H, S, V  (E.g. 360,100,100)';
  const input = document.createElement('input');
  input.type = "text";
  input.id = `color-code-${nextId}`;
  const button = document.createElement('button');
  button.textContent = 'Select color';
  form.appendChild(label);
  form.appendChild(span);
  form.appendChild(input);
  form.appendChild(button);

  const circleControls = document.createElement('div');
  circleControls.classList.add('flex', 'flex-col', 'gap-4', 'bg-light-blue');

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('flex', 'justify-content-space-around');

  const lockButton = document.createElement('button');
  lockButton.textContent = 'Lock';

  const increaseBrightness = document.createElement('button');
  increaseBrightness.textContent = 'B +';

  const decreaseBrightness = document.createElement('button');
  decreaseBrightness.textContent = 'B -';

  buttonContainer.appendChild(lockButton);
  buttonContainer.appendChild(increaseBrightness);
  buttonContainer.appendChild(decreaseBrightness);

  circleControls.appendChild(form);
  circleControls.appendChild(selectedColorBox);
  circleControls.appendChild(buttonContainer);

  circleDetails.appendChild(circleControls);

  const elementToColor = document.querySelector(`.slide-content-${nextId}`);
  const propertyToColor = definePropertyToColor(elementToColor);

  //create pointerDetails and add to map
  const pointerDetails = {
    isLocked: false,
    pointer,
    // pointerId: `pointer-${nextId}`,
    selectedColorBox: selectedColorBox,
    form,
    colorCodeInput: input,
    elementToColor,
    propertyToColor,
    hsvColorArr: [235, 76, 100],
    currentPointerRotation: 0
  }
  pointerIdsAndDetails.set(`pointer-${nextId}`, pointerDetails);


  //add event listeners
  form.addEventListener('submit', event => {
    plotColorAndUpdateContent(event, canvas1, colorOverlay1,
      colorPlotterRotator1, colorPlotterMarker1, pointerDetails);

  });

  lockButton.addEventListener('click', () => {
    pointerDetails.isLocked = !pointerDetails.isLocked;
    lockButton.textContent = pointerDetails.isLocked ? 'Unlock' : 'Lock';
  });

  pointer.addEventListener('click', (event) => {
    event.stopPropagation();
    activePointerId = pointerDetails.pointer.id;
    updateColorWheelBrightness(pointerDetails, colorOverlay1);
  });

  increaseBrightness.addEventListener('click', () => {
    let newBrightness = Number(pointerDetails.hsvColorArr[2]) + 10;
    if (newBrightness > 100) {
      newBrightness = 100;
    }
    pointerDetails.hsvColorArr[2] = newBrightness;
    paintHSVColorArrChangesToScreen(pointerDetails);
    updateColorWheelBrightness(pointerDetails, colorOverlay1);
  });

  decreaseBrightness.addEventListener('click', () => {
    let newBrightness = Number(pointerDetails.hsvColorArr[2]) - 10;
    if (newBrightness < 0) {
      newBrightness = 0;
    }
    pointerDetails.hsvColorArr[2] = newBrightness;
    paintHSVColorArrChangesToScreen(pointerDetails);
    updateColorWheelBrightness(pointerDetails, colorOverlay1);
  });

  //Add to dom
  pointerContainer1.appendChild(pointer);

  //init pointer
  initColor(canvas1, pointerDetails, colorPlotterRotator1, colorPlotterMarker1);


}

function definePropertyToColor(elementToColor) {
  let propertyToColor;
  const classListArr = Array.from(elementToColor.classList);
  classListArr.forEach((clazz) => {
    if (clazz.startsWith('change-')) {
      propertyToColor = clazz.substring(clazz.indexOf('-') + 1);
    }
  });
  return propertyToColor;
}

function resetPointerContainerRotation(pointerDetails, newRotationValue) {
  pointerDetails.currentPointerRotation = newRotationValue;
}

function pickAndUpdateContent(event, canvas, canvasContext) {
  const pointerDetails = pointerIdsAndDetails.get(activePointerId);
  resetPointerContainerRotation(pointerDetails, 0);

  const canvasBounding = canvas.getBoundingClientRect();
  const x = event.clientX - canvasBounding.left;
  const y = event.clientY - canvasBounding.top;
  const pixel = canvasContext.getImageData(x, y, 1, 1);
  const data = pixel.data;

  pointerDetails.pointer.style.left = x + "px";
  pointerDetails.pointer.style.top = y + "px";


  let rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
  const newHSVPlottedColorArr = rgbStringToHSVArr(rgba);
  //brightness is not retrieved from the image. A CSS overlay changes the look of the image but the overlay does not change the actual image data.
  const brightness = pointerDetails.hsvColorArr[2];
  newHSVPlottedColorArr[2] = brightness;
  pointerDetails.hsvColorArr = newHSVPlottedColorArr;


  paintHSVColorArrChangesToScreen(pointerDetails);

}

// update the screen to reflect changes in pointerDetails.hsvColorArr
function paintHSVColorArrChangesToScreen(pointerDetails) {
  const rgba = hsvArrToRGBString(pointerDetails.hsvColorArr);
  pointerDetails.selectedColorBox.style.background = rgba;
  pointerDetails.selectedColorBox.textContent = rgba + " hsv-- " + pointerDetails.hsvColorArr;

  //assign color to propertyToColor
  pointerDetails.elementToColor.style[pointerDetails.propertyToColor] = rgba;
  return rgba;
}

function rotatePointersAndUpdateContent(degreesToRotate, canvas, colorPlotterRotator, colorPlotterMarker) {

  //loop over unlocked pointer containers and rotate them.
  for (let pDetails of pointerIdsAndDetails.values()) {
    if (!pDetails.isLocked) {
      degreesToRotate = Number(degreesToRotate);
      const hueBeforeRotation = Number(pDetails.hsvColorArr[0]);

      pDetails.currentPointerRotation += degreesToRotate;
      if (pDetails.currentPointerRotation > 360) {
        pDetails.currentPointerRotation = pDetails.currentPointerRotation % 360;
      }

      pDetails.hsvColorArr[0] = hueBeforeRotation + degreesToRotate;
      if (pDetails.hsvColorArr[0] < 0) {
        pDetails.hsvColorArr[0] = 360 - Math.abs(pDetails.hsvColorArr[0]);
      }
      if (pDetails.hsvColorArr[0] > 360) {
        pDetails.hsvColorArr[0] = pDetails.hsvColorArr[0] % 360;
      }


      plotColor(colorPlotterRotator, pDetails, canvas, colorPlotterMarker);


      paintHSVColorArrChangesToScreen(pDetails);

    }
  }




}



function plotColorAndUpdateContent(event = undefined, canvas, colorOverlay,
  colorPlotterRotator, colorPlotterMarker,
  pointerDetails) {

  event.preventDefault();

  const inputValue = pointerDetails.colorCodeInput.value;
  pointerDetails.hsvColorArr = inputValue.split(',').filter((ele) => ele.trim());

  plotColor(colorPlotterRotator, pointerDetails, canvas, colorPlotterMarker);

  paintHSVColorArrChangesToScreen(pointerDetails);

  updateColorWheelBrightness(pointerDetails, colorOverlay);
}

function updateColorWheelBrightness(pointerDetails, colorOverlay) {
  const brightness = 100 - pointerDetails.hsvColorArr[2];
  colorOverlay.style.opacity = brightness + '%';
}

function plotColor(colorPlotterRotator, pDetails, canvas, colorPlotterMarker) {
  colorPlotterRotator.style.rotate = (pDetails.hsvColorArr[0]) + 'deg';
  //hue is degrees, saturation is height and width of color-plotter-rotator
  colorPlotterRotator.style.height = pDetails.hsvColorArr[1] + '%';
  colorPlotterRotator.style.width = pDetails.hsvColorArr[1] + '%';
  //get the bounding rect of color-plotter-marker and canvas
  const canvasBounding = canvas.getBoundingClientRect();
  const colorPlotterMarkerBounding = colorPlotterMarker.getBoundingClientRect();
  const y = colorPlotterMarkerBounding.top - canvasBounding.top;
  const x = colorPlotterMarkerBounding.left - canvasBounding.left;
  //move marker
  pDetails.pointer.style.top = y + 'px';
  pDetails.pointer.style.left = x + 'px';
}

function initColor(canvas, pointerDetails,
  colorPlotterRotator, colorPlotterMarker) {

  //hue is degrees, saturation is height and width of color-plotter-rotator
  colorPlotterRotator.style.rotate = pointerDetails.hsvColorArr[0] + 'deg';
  colorPlotterRotator.style.height = pointerDetails.hsvColorArr[1] + '%';
  colorPlotterRotator.style.width = pointerDetails.hsvColorArr[1] + '%';
  //get the bounding rect of color-plotter-marker and canvas
  const canvasBounding = canvas.getBoundingClientRect();
  const colorPlotterMarkerBounding = colorPlotterMarker.getBoundingClientRect();
  const y = colorPlotterMarkerBounding.top - canvasBounding.top;
  const x = colorPlotterMarkerBounding.left - canvasBounding.left;

  //move marker
  pointerDetails.pointer.style.top = y + 'px';
  pointerDetails.pointer.style.left = x + 'px';
  pointerDetails.pointer.style.display = "flex";

  const rgbPlottedColor = hsvArrToRGBString(pointerDetails.hsvColorArr);
  pointerDetails.selectedColorBox.style.background = rgbPlottedColor;
  pointerDetails.selectedColorBox.textContent = rgbPlottedColor + " HSV-- " + pointerDetails.hsvColorArr;
}

function hsvArrToRGBString(hsvArr) {
  const rgbObj = colord({
    h: hsvArr[0],
    s: hsvArr[1], v: hsvArr[2]
  }).toRgb();
  const rgbString = `rgba(${rgbObj.r},
         ${rgbObj.g}, ${rgbObj.b},
          ${rgbObj.a})`;
  return rgbString;
}

function rgbStringToHSVArr(rgbString) {
  const hsvObj = colord(rgbString).toHsv();
  return [hsvObj.h, hsvObj.s, hsvObj.v];
}



//Event Listeners
rotatePointerContainerClockwiseBtn.addEventListener('click',
  event => rotatePointersAndUpdateContent(10, canvas1, colorPlotterRotator1, colorPlotterMarker1));
rotatePointerContainerAntiClockwiseBtn.addEventListener('click',
  event => rotatePointersAndUpdateContent(-10, canvas1, colorPlotterRotator1, colorPlotterMarker1));

pointerContainer1.addEventListener('click', event => pickAndUpdateContent(event, canvas1, ctx1
));
addPointer.addEventListener('click', () => {
  createPointer();
})



