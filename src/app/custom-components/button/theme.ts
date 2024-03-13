//TO DO

import { SimpleChanges } from '@angular/core';

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
//If component does not use disabled state, just set it as isEnabled
export class Theme {
  addVariantWhenDisabled = true;
  component: any;
  mode: string = 'light';

  setToSpacedString(classesSet: Set<string>) {
    return Array.from(classesSet.keys()).join(' ');
  }

  //To do:changesObj should be optional argument
  getCSSClassesStringByHTMLLevel(
    desiredCSSPropsByHTMLLevel: CSSPropsByHTMLLevel,
    currentDisabledState: DisabledState,
    cssChangesByHTMLLevel?: CSSChangesByHTMLLevel
  ) {
    const cssClassesSetsByHTMLLevel = this.getCSSClassesSetsByHTMLLevel(
      desiredCSSPropsByHTMLLevel,
      currentDisabledState
    );
    const cssClassesStringsByHTMLLevel: CSSClassesStringsByHTMLLevel = {};
    Object.keys(cssClassesSetsByHTMLLevel).forEach((HTMLLevel) => {
      const cssClassesSet = cssClassesSetsByHTMLLevel[HTMLLevel];

      // trim because if developer adds leading or trailing spaces by mistake many
      // things will not work as we rely on fetching the exact values from sets.
      const trimmedCSSClassesSet = this.trimValues(cssClassesSet);

      let finalCSSClassesSet;
      //If changesObj exists, then the developer wants to add/delete some of the classes
      if (cssChangesByHTMLLevel && cssChangesByHTMLLevel[HTMLLevel]) {
        finalCSSClassesSet = this.editCSSClasses(
          trimmedCSSClassesSet,
          cssChangesByHTMLLevel[HTMLLevel]
        );
      } else {
        finalCSSClassesSet = trimmedCSSClassesSet;
      }

      cssClassesStringsByHTMLLevel[HTMLLevel] =
        this.setToSpacedString(finalCSSClassesSet);
    });
    return cssClassesStringsByHTMLLevel;
  }

  getCSSClassesSetsByHTMLLevel(
    desiredCSSPropsByHTMLLevel: CSSPropsByHTMLLevel,
    currentDisabledState: DisabledState
  ) {
    // const cssClassesByHTMLLevel: CSSClassesByHTMLLevel = {
    //   container: new Set(),
    //   textContent: new Set(),
    // };
    const cssClassesByHTMLLevel: CSSClassesByHTMLLevel = {};
    Object.entries(desiredCSSPropsByHTMLLevel).forEach(
      ([HTMLLevel, HTMLLevelProps]) => {
        cssClassesByHTMLLevel[HTMLLevel] = new Set();
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
          cssClassesByHTMLLevel[HTMLLevel] = new Set([
            ...cssClassesByHTMLLevel[HTMLLevel],
            ...propVariantSetCopy,
          ]);
        });
      }
    );
    return cssClassesByHTMLLevel;
  }

  editCSSClasses(cssClassesSet: Set<string>, cssChanges: CSSChanges) {
    const { add, remove } = cssChanges;
    if (add) {
      if (typeof add === 'string') {
        const cssClass = add;
        cssClassesSet.add(cssClass.trim());
      } else {
        const cssClasses = add;
        cssClasses.forEach((cssClass) => {
          cssClassesSet.add(cssClass.trim());
        });
      }
    }
    if (remove) {
      if (typeof remove === 'string') {
        const cssClass = remove;
        cssClassesSet.delete(cssClass.trim());
      } else {
        const cssClasses = remove;
        cssClasses.forEach((cssClass) => {
          cssClassesSet.delete(cssClass.trim());
        });
      }
    }

    return cssClassesSet;
  }

  transformComponentInput(
    inputPropObjects: {
      inputPropName: string;
      inputPropValue: string;
    }[]
  ) {
    const component: Component = structuredClone(this.component);
    const cssPropsByHTMLLevel: CSSPropsByHTMLLevel = {};
    const componentHTMLLevelKeys: string[][] = []; //For error checking
    const inputPropObjectsHTMLLevelKeys: string[] = []; //For error checking

    Object.entries(component[this.mode]).forEach(([HTMLLevel, propObj]) => {
      componentHTMLLevelKeys.push(Object.keys(component[this.mode][HTMLLevel]));
      cssPropsByHTMLLevel[HTMLLevel] = propObj as any;
      inputPropObjects.forEach((inputPropObj) => {
        if (cssPropsByHTMLLevel[HTMLLevel][inputPropObj.inputPropName]) {
          inputPropObjectsHTMLLevelKeys.push(inputPropObj.inputPropName);
          cssPropsByHTMLLevel[HTMLLevel][inputPropObj.inputPropName] =
            inputPropObj.inputPropValue;
        }
      });
    });

    const flattenedComponentObjHTMLLevelKeys = componentHTMLLevelKeys.flatMap(
      (key) => key
    );
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

    return cssPropsByHTMLLevel;
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

  private trimValues(classesSet: Set<string>) {
    const trimmedClassesSet: Set<string> = new Set();
    classesSet.forEach((cssClass) => {
      trimmedClassesSet.add(cssClass.trim());
    });
    return trimmedClassesSet;
  }
}

type DisabledState = 'isDisabled' | 'isEnabled';
type CSSClassesStringsByHTMLLevel = { [key: string]: string };

type CSSChanges = {
  add?: string | string[];
  remove?: string | string[];
};
type CSSChangesByHTMLLevel = {
  [key: string]: {
    add?: string | string[];
    remove?: string | string[];
  };
};
type Component = {
  [key: string]: {
    //light
    [key: string]: {
      //container
      [key: string]: {
        //variant
        [key: string]: Set<string>;
      };
    };
  };
};

type CSSClassesByHTMLLevel = {
  [key: string]: Set<string>;
};

type CSSPropsByHTMLLevel = {
  [key: string]: {
    [key: string]: string;
  };
};
