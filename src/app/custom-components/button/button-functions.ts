// @ts-nocheck

//TO DO
//Include types
//Light and dark theme
//Construct instance of the class with the current theme.
export class ButtonFunctions {
  container = {
    //HTMLLevel
    disabled: {
      //isDisabled so as to avoid disabled.disabled
      isDisabled: new Set(['opacity-50', 'cursor-not-allowed']), //  isDisabled:propVariant //  'opacity-50':propClass
      isEnabled: new Set(),
    },
    rounded: {
      //prop name
      //always use Sets to have a consistent API.
      full: new Set(['rounded-full']),
      sm: new Set(['rounded-sm']),
      md: new Set(['rounded-md']),
    },
    size: {
      sm: new Set(['px-1', 'py-2']),
      md: new Set(['px-2', 'py-3']),
    },

    variant: {
      primary: new Set([' bg-purple-500', 'hover:enabled:bg-purple-600']),
      secondary: new Set([' bg-pink-500', 'hover:enabled:bg-pink-600']),
      primaryOutlined: new Set([
        'bg-white',
        'hover:enabled:bg-purple-500',
        'border-2 border-purple-500',
      ]),
      secondaryOutlined: new Set([
        'bg-white',
        'hover:enabled:bg-pink-500',
        'border-2 border-purple-500',
      ]),
    },
  };

  textContent = {
    size: {
      sm: new Set(['text-sm']),
      md: new Set(['text-md']),
    },

    variant: {
      primary: new Set(['text-white']),
      secondary: new Set(['text-white']),
      primaryOutlined: new Set(['text-purple-500']),
      secondaryOutlined: new Set(['text-pink-500']),
    },
  };

  //This would be imported from elsewhere.
  //To do: make sure this object cannot be manipulated from outside the class, Make it private
  themeObj = {
    button: {
      //represent different layers of the HTML
      container: {
        disabled: this.container.disabled,
        rounded: this.container.rounded,
        variant: this.container.variant,
        size: this.container.size,
      },
      textContent: {
        size: this.textContent.size,
        variant: this.textContent.variant,
      },
    },
    /* Add your own custom objects under the custom key
    custom:{
      button:{//....}
      CTAButton:{//...}
    }
    */
  };

  convertSetToSpacedString(classesSet) {
    return Array.from(classesSet.keys()).join(' ');
  }

  //To do:changesObj should be optional argument
  getPossiblyModifiedClassesAsStrings(desiredClassesObj, changesObj) {
    const classesSets = this.getClassesByHTMLLevelAsSets(desiredClassesObj);
    const returnObject = {};
    Object.keys(classesSets).forEach((HTMLLevel) => {
      const classesSet = classesSets[HTMLLevel];
      let finalClassesSet;
      //If changesObj exists, then the developer wants to add/delete some of the classes
      if (changesObj && changesObj[HTMLLevel]) {
        finalClassesSet = this.editClasses(classesSet, changesObj[HTMLLevel]);
      } else {
        finalClassesSet = classesSet;
      }

      returnObject[HTMLLevel] = this.convertSetToSpacedString(finalClassesSet);
    });
    return returnObject;
  }

  getClassesByHTMLLevelAsSets(desiredClassesObj) {
    const returnObject = {
      container: new Set(),
      textContent: new Set(),
    };
    Object.entries(desiredClassesObj).forEach(([HTMLLevel, HTMLLevelProps]) => {
      returnObject[HTMLLevel] = new Set();
      Object.keys(HTMLLevelProps).forEach((propName) => {
        const propVariant = HTMLLevelProps[propName];
        const propVariantSet =
          this.themeObj.button[HTMLLevel][propName][propVariant];
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
    const buttonObj = structuredClone(this.themeObj.button);
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

// const myArgs = {
//   container: {
//     disabled: 'isDisabled',
//     rounded: 'full',
//     size: 'md',
//     variant: 'primaryOutlined',
//   },
//   textContent: {
//     size: 'md',
//     variant: 'primaryOutlined',
//   },
// };

// const buttonClass = new ButtonFunctions();
// const classesAsSets = buttonClass.getClassesByHTMLLevelAsSets(myArgs);
// console.log('**** getClassesAsSets below');
// console.log(classesAsSets);

// const classesAsStrings =
//   buttonClass.getPossiblyModifiedClassesAsStrings(myArgs);
// console.log(classesAsStrings);

// //buttonClass is what is called inside the component after having received the developer arguments.
// const modifiedClassesAsStrings =
//   buttonClass.getPossiblyModifiedClassesAsStrings(myArgs, {
//     container: {
//       add: ['sm:rounded-sm', 'md:rounded-md', 'sm:font-medium'],
//       remove: 'rounded-full',
//     },
//     textContent: {
//       add: 'bg-green-500',
//     },
//   });
// console.log(modifiedClassesAsStrings);

/*
Construct this in the component based on the Input props available.
We need to transform the props from the format the developer enters them via @Input into a format that we can use to
fetch the correct classes as strings for the correct HTML element.
*/
// const transformedArgs = [
//   {
//     inputPropName: 'rounded',
//     inputPropValue: 'full',
//   },
//   {
//     inputPropName: 'size',
//     inputPropValue: 'md',
//   },

//   {
//     inputPropName: 'variant',
//     inputPropValue: 'primaryOutlined',
//   },

//   {
//     inputPropName: 'disabled',
//     inputPropValue: 'isEnabled',
//   },
// ];
// const transformedInput = buttonClass.transformComponentInput(transformedArgs);
// console.log('transformedInput below');
// console.log(transformedInput);

// const classesAsSetsWithtransformed =
//   buttonClass.getClassesByHTMLLevelAsSets(transformedInput);
// console.log('*** classesAsSetsWithtransformed');
// console.log(classesAsSetsWithtransformed);
// const classesAsSets2 = buttonClass.getClassesByHTMLLevelAsSets(myArgs);
// console.log('getClassesAsSets2 below');
// console.log(classesAsSets2);

/*
1. user inputs props and possibly object for media queries.
2. Transform input
  Input received from transform fn like below:
  {
  container: {
    disabled: 'isEnabled',
    rounded: 'full',
    variant: 'primaryOutlined',
    size: 'md'
  },
  textContent: { size: 'md', variant: 'primaryOutlined' }
}
3. receive media query in following format:
{
  container: {
    add: ["sm:rounded-sm", "md:rounded-md", "sm:font-medium"],
    remove: "rounded-full"
  },
  textContent: {
    add: "bg-green-500"
  }
}
Just use getPossiblyModifiedClassesAsStrings with the transformed input and only enter the changes object if it exists.
//
// 1. Get classes as Set object by using input from step 2.
// 2. Loop over keys from step 2 and call editClasses with the corresponding arguments from step 3.



*/
