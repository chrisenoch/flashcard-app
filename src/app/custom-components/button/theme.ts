// @ts-nocheck

export class Theme {
  getTheme() {
    return structuredClone(this.themeObj);
  }

  setToSpacedString(classesSet) {
    return Array.from(classesSet.keys()).join(' ');
  }

  //To do:changesObj should be optional argument
  getPossiblyModifiedClassesAsStrings(
    desiredClassesObj,
    currentDisabledState,
    changesObj
  ) {
    const classesSets = this.getClassesByHTMLLevelAsSets(
      desiredClassesObj,
      currentDisabledState
    );
    const returnObject = {};
    Object.keys(classesSets).forEach((HTMLLevel) => {
      const classesSet = classesSets[HTMLLevel];

      //To do
      //Can not add variants if disabled here.

      let finalClassesSet;
      //If changesObj exists, then the developer wants to add/delete some of the classes
      if (changesObj && changesObj[HTMLLevel]) {
        finalClassesSet = this.editClasses(classesSet, changesObj[HTMLLevel]);
      } else {
        finalClassesSet = classesSet;
      }

      returnObject[HTMLLevel] = this.setToSpacedString(finalClassesSet);
    });
    return returnObject;
  }

  getClassesByHTMLLevelAsSets(desiredClassesObj, currentDisabledState) {
    const returnObject = {
      container: new Set(),
      textContent: new Set(),
    };
    Object.entries(desiredClassesObj).forEach(([HTMLLevel, HTMLLevelProps]) => {
      returnObject[HTMLLevel] = new Set();
      Object.keys(HTMLLevelProps).forEach((propName) => {
        const propVariant = HTMLLevelProps[propName];
        if (
          propName === 'variant' &&
          currentDisabledState === 'isDisabled' &&
          !this.addVariantWhenDisabled
        ) {
          return;
        }

        const propVariantSet = this.button[HTMLLevel][propName][propVariant];
        const propVariantSetCopy = new Set([...propVariantSet]);
        returnObject[HTMLLevel] = new Set([
          ...returnObject[HTMLLevel],
          ...propVariantSetCopy,
        ]);
      });
    });
    return returnObject;
  }

  editClasses(classesSet, changes) {
    const { add, remove } = changes;
    if (add) {
      if (typeof add === 'string') {
        const cssClass = add;
        classesSet.add(cssClass);
      } else {
        const cssClasses = add;
        cssClasses.forEach((cssClass) => {
          classesSet.add(cssClass);
        });
      }
    }
    if (remove) {
      if (typeof remove === 'string') {
        const cssClass = remove;
        classesSet.delete(cssClass);
      } else {
        const cssClasses = remove;
        cssClasses.forEach((cssClass) => {
          classesSet.delete(cssClass);
        });
      }
    }

    return classesSet;
  }

  transformComponentInput(inputPropObjects) {
    const buttonObj = structuredClone(this.button);
    const classesObj = {};
    const buttonObjHTMLLevelKeys = []; //For error checking
    const inputPropObjectsHTMLLevelKeys = []; //For error checking
    Object.entries(buttonObj).forEach(([HTMLLevel, propObj]) => {
      buttonObjHTMLLevelKeys.push(Object.keys(buttonObj[HTMLLevel]));
      classesObj[HTMLLevel] = propObj;
      inputPropObjects.forEach((inputPropObj) => {
        if (classesObj[HTMLLevel][inputPropObj.inputPropName]) {
          inputPropObjectsHTMLLevelKeys.push(inputPropObj.inputPropName);
          classesObj[HTMLLevel][inputPropObj.inputPropName] =
            inputPropObj.inputPropValue;
        }
      });
    });
    const flattenedButtonObjHTMLLevelKeys = buttonObjHTMLLevelKeys.flatMap(
      (key) => key
    );
    if (
      flattenedButtonObjHTMLLevelKeys.length !==
      inputPropObjectsHTMLLevelKeys.length
    ) {
      let errorMessageHint = '';
      if (
        flattenedButtonObjHTMLLevelKeys.length >
        inputPropObjectsHTMLLevelKeys.length
      ) {
        const flattenedButtonObjHTMLLevelKeysSet = new Set([
          ...flattenedButtonObjHTMLLevelKeys,
        ]);
        inputPropObjectsHTMLLevelKeys.forEach((key) => {
          flattenedButtonObjHTMLLevelKeysSet.delete(key);
        });
        errorMessageHint =
          'The extra keys are in the button theme object and are: ' +
          [...flattenedButtonObjHTMLLevelKeysSet].join();
      } else {
        const inputPropObjectsHTMLLevelKeysSet = new Set([
          ...flattenedButtonObjHTMLLevelKeys,
        ]);
        flattenedButtonObjHTMLLevelKeys.forEach((key) => {
          inputPropObjectsHTMLLevelKeysSet.delete(key);
        });
        errorMessageHint =
          'The extra keys are in the inputPropObjects array argument for this function and are: ' +
          [...inputPropObjectsHTMLLevelKeysSet].join();
      }

      throw new Error(
        'Input mismatch. You must account for all the prop names in the component theme object in the inputPropObjects array argument for this function. ' +
          errorMessageHint
      );
    }

    return classesObj;
  }
}

// export const themeObj = {
//   button: {
//     //represent different layers of the HTML
//     container: {
//       default: this.container.default,
//       disabled: this.container.disabled,
//       rounded: this.container.rounded,
//       variant: this.container.variant,
//       size: this.container.size,
//     },
//     textContent: {
//       size: this.textContent.size,
//       variant: this.textContent.variant,
//     },
//   },
//   //To do: buttonConfig should be inside the button object.
//   //This can contain extra data about the button.
//   buttonConfig: {},
//   /* Add your own custom objects under the custom key
//     custom:{
//       button:{//....}
//       CTAButton:{//...}
//     }
//     */
// };
