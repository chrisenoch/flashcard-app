//@ts-nocheck

//TO DO

//Extract all these methods into a theme class so they can be used for any component. E.g. For the curent: const propVariantSet =
//this.themeObj.button[HTMLLevel][propName][propVariant]; 'button' should be dynamic and be able to be replaced with any component.
//Include types
//Ability to turrn off all styles? - Can alerady do this by extending and overriding the sets.
//Light and dark theme
//Construct instance of the class with the current theme.
//Each variant should have light, normal and dark versions. This is not related to light/dark theme. E.g. If pink is a variant, the developer should be able to use a light/dark pink button easily.
//Add tertiary variant. I always want a third main colour.
//Add colou methods to get inverse, etc. Should be able to just add an arbitrary colour and then button hover, focus, and other states should adjust automatially.
//Create your own compoennt by extending theme.
//Modify an existing component by extending the component. E.g. extend Button.
//My idea is: Theme-> Component (with css) -> component (with js). This way develoepr can choose if he wants the JavaScript or only the CSS version.
export class Theme {
  // getTheme() {
  //   return structuredClone(this.themeObj);
  // }
  addVariantWhenDisabled = true;
  component: any;

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
        console.log('addvariantwhendisabled');
        console.log(this.addVariantWhenDisabled);
        if (
          propName === 'variant' &&
          currentDisabledState === 'isDisabled' &&
          !this.addVariantWhenDisabled
        ) {
          return;
        }

        const propVariantSet = this.component[HTMLLevel][propName][propVariant];
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
    const buttonObj = structuredClone(this.component);
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

  checkIfCSSInputsChanged(
    changes: SimpleChanges,
    transformedCSSInputArgs: {
      inputPropName: string;
      inputPropValue: any;
    }[]
  ) {
    let haveChanged = false;
    for (let i = 0; i < transformedCSSInputArgs.length; i++) {
      const inputPropName = transformedCSSInputArgs[i].inputPropName;
      if (
        changes[inputPropName]?.currentValue !==
        changes[inputPropName]?.previousValue
      ) {
        haveChanged = true;
        break;
      }
    }
    return haveChanged;
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
