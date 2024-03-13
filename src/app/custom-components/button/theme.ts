//@ts-nocheck

//TO DO

//Extract all these methods into a theme class so they can be used for any component. E.g. For the curent: const propVariantSet =
//this.themeObj.button[HTMLLevel][propName][propVariant]; 'button' should be dynamic and be able to be replaced with any component.
//Include types
//Ability to turrn off all styles? - Can alerady do this by extending and overriding the sets.
//Light and dark theme
//Construct instance of the class with the current theme.
//Add tertiary variant. I always want a third main colour.
//Add colour methods to get inverse, etc. Should be able to just add an arbitrary colour and then button hover, focus, and other states should adjust automatially.
//Create your own compoennt by extending theme.
//Modify an existing component by extending the component. E.g. extend Button.
//My idea is: Theme-> Component (with css) -> component (with js). This way develoepr can choose if he wants the JavaScript or only the CSS version.
export class Theme {
  addVariantWhenDisabled = true;
  component: any;
  mode: string = 'light';

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

      // trim because if developer adds leading or trailing spaces by mistake many
      // things will not work as we rely on fetching the exact values from sets.
      const trimmedClassesSet = this.trimValues(classesSet);

      let finalClassesSet;
      //If changesObj exists, then the developer wants to add/delete some of the classes
      if (changesObj && changesObj[HTMLLevel]) {
        finalClassesSet = this.editClasses(
          trimmedClassesSet,
          changesObj[HTMLLevel]
        );
      } else {
        finalClassesSet = trimmedClassesSet;
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

        const propVariantSet =
          this.component[this.mode][HTMLLevel][propName][propVariant];
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
        classesSet.add(cssClass.trim());
      } else {
        const cssClasses = add;
        cssClasses.forEach((cssClass) => {
          classesSet.add(cssClass.trim());
        });
      }
    }
    if (remove) {
      if (typeof remove === 'string') {
        const cssClass = remove;
        classesSet.delete(cssClass.trim());
      } else {
        const cssClasses = remove;
        cssClasses.forEach((cssClass) => {
          classesSet.delete(cssClass.trim());
        });
      }
    }

    return classesSet;
  }

  transformComponentInput(inputPropObjects) {
    const componentObj = structuredClone(this.component);
    const classesObj = {};
    const componentObjHTMLLevelKeys = []; //For error checking
    const inputPropObjectsHTMLLevelKeys = []; //For error checking
    Object.entries(componentObj[this.mode]).forEach(([HTMLLevel, propObj]) => {
      componentObjHTMLLevelKeys.push(
        Object.keys(componentObj[this.mode][HTMLLevel])
      );
      classesObj[HTMLLevel] = propObj;
      inputPropObjects.forEach((inputPropObj) => {
        if (classesObj[HTMLLevel][inputPropObj.inputPropName]) {
          inputPropObjectsHTMLLevelKeys.push(inputPropObj.inputPropName);
          classesObj[HTMLLevel][inputPropObj.inputPropName] =
            inputPropObj.inputPropValue;
        }
      });
    });

    console.log('componentObjHTMLLevelKeys');
    console.log(componentObjHTMLLevelKeys);

    console.log('inputPropObjectsHTMLLevelKeys');
    console.log(inputPropObjectsHTMLLevelKeys);

    const flattenedComponentObjHTMLLevelKeys =
      componentObjHTMLLevelKeys.flatMap((key) => key);
    if (
      flattenedComponentObjHTMLLevelKeys.length !==
      inputPropObjectsHTMLLevelKeys.length
    ) {
      let errorMessageHint = '';
      if (
        flattenedComponentObjHTMLLevelKeys.length >
        inputPropObjectsHTMLLevelKeys.length
      ) {
        const flattenedComponentObjHTMLLevelKeysSet = new Set([
          ...flattenedComponentObjHTMLLevelKeys,
        ]);
        inputPropObjectsHTMLLevelKeys.forEach((key) => {
          flattenedComponentObjHTMLLevelKeysSet.delete(key);
        });
        errorMessageHint =
          'The extra keys are in the component theme object and are: ' +
          [...flattenedComponentObjHTMLLevelKeysSet].join();
      } else {
        const inputPropObjectsHTMLLevelKeysSet = new Set([
          ...flattenedComponentObjHTMLLevelKeys,
        ]);
        flattenedComponentObjHTMLLevelKeys.forEach((key) => {
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

    console.log('classesObj');
    console.log(classesObj);
    return classesObj;
  }

  checkIfInputsChanged(
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

  private trimValues(classesSet: any) {
    const trimmedClassesSet = new Set();
    classesSet.forEach((cssClass) => {
      trimmedClassesSet.add(cssClass.trim());
    });
    return trimmedClassesSet;
  }
}
