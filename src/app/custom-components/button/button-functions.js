//TO DO
//How to handle disabled?
//If disabled do not return certian values, liek primary colours. Also, set cursor to not-allowed.
//Default values?
//How deal with if outlined or not? - Separate entirely?
//How get the classes
//Media queries?
//Light and dark theme

//   if (isDisabled) {
//     classes.add('cursor-not-allowed');
//     //To do: Maybe change this.
//     classes.add('opacity-50');
//   }

class ButtonFunctions {
  container = { //HTMLLevel
    rounded: {  //prop name
      //always use Sets to have a consistent API?
      full: new Set(['rounded-full']),
      sm: new Set(['rounded-sm']),
      md: new Set(['rounded-md']),
    },
    size: {
      sm: new Set(['px-1', 'py-2']), //  sm:propvariant //  text-sm:propClass
      md: new Set(['px-2', 'py-3']),
    },

    variant: {
      primary: new Set([' bg-purple-500', 'hover:enabled:bg-purple-600']),
      secondary: new Set([' bg-pink-500', 'hover:enabled:bg-pink-600']),
      primaryOutlined: new Set([
        ' bg-white',
        'hover:enabled:bg-purple-500',
        'border-2 border-purple-500',
      ]),
      secondaryOutlined: new Set([
        ' bg-white',
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

  //new Classes would be global theme object imported from elsewhere
  //To do: make sure this object cannot be manipulated from outside the class, Make it private
  newClassesObj = {
    button: {
      //represent different layers of the HTML
      container: {
        rounded: this.container.rounded,
        variant: this.container.variant,
        size: this.container.size,
      },
      textContent: {
        size: this.textContent.size,
        variant: this.textContent.variant,
      },
    },
  };

  getClasses(classesSet) {
    return Array.from(classesSet.keys()).join(' ');
  }

  //To do: merge with getModifiedClassesAsStrings
  getClassesAsStrings(desiredClassesObj) {
    const classesSets = this.getClassesAsSets(desiredClassesObj);
    const returnObject = {};
    Object.keys(classesSets).forEach((HTMLLevel) => {
      const classesSet = classesSets[HTMLLevel];
      returnObject[HTMLLevel] = this.getClasses(classesSet);
    })
    return returnObject;
  }

  //To do: merge with getClassesAsStrings
  //Problem: editClasses expects changesObj for ONE set. changesObj has multiple changesObjs
  //Solution:changesObj has ses by the name of the HTMLLevel which must match with the button object HTML Levels
  getModifiedClassesAsStrings(desiredClassesObj, changesObj) {
    const classesSets = this.getClassesAsSets(desiredClassesObj);

    const returnObject = {};
    Object.keys(classesSets).forEach((HTMLLevel) => {
      const classesSet = classesSets[HTMLLevel];

      let finalClassesSet;
      if (changesObj[HTMLLevel]) {
        finalClassesSet = this.editClasses(classesSet, changesObj[HTMLLevel]);
      } else {
        finalClassesSet = classesSet;
      }

      returnObject[HTMLLevel] = this.getClasses(finalClassesSet);
    })
    return returnObject;
  }

  getClassesAsSets(desiredClassesObj) {
    const returnObject = {
      container: new Set(),
      textContent: new Set(),
    };
    Object.entries(desiredClassesObj).forEach(
      ([HTMLLevel, HTMLLevelProps]) => {
        returnObject[HTMLLevel] = new Set();
        Object.keys(HTMLLevelProps).forEach((propName) => {
          const propVariant = HTMLLevelProps[propName];
          const propVariantSet =
            this.newClassesObj.button[HTMLLevel][propName][propVariant];
          //add to main classesSet
          returnObject[HTMLLevel] = new Set([
            ...returnObject[HTMLLevel],
            ...propVariantSet,
          ]);
        });
      }
    );
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

}

const myArgs = {
  container: {
    rounded: 'full',
    size: 'md',
    variant: 'primaryOutlined'
  },
  textContent: {
    size: 'md',
    variant: 'primaryOutlined',
  }
}

const buttonClass = new ButtonFunctions();
const classesAsSets = buttonClass.getClassesAsSets(myArgs);
console.log(classesAsSets);

const classesAsStrings = buttonClass.getClassesAsStrings(myArgs);
console.log(classesAsStrings);

//This is what is called inside the component after having received the developer arguments.
//The developer would not provide separate args for container and textContent as is the case in myArgs above.
//The dev would just write rounded=full, size=md.
//To do: convert the variables the developer provides (e.g. rounded=full), to the object like myArgs above.
//To do: Same but for media queries.
const modifiedClassesAsStrings = buttonClass.getModifiedClassesAsStrings(myArgs, {
  container: {
    add: ["sm:rounded-sm", "md:rounded-md", "sm:font-medium"],
    remove: "rounded-full"
  }
});
console.log(modifiedClassesAsStrings);

/*
Simulate @Input props
Input format of function?/Array of {inputpropStringname:InputpropValue} - use my getFields to transform class variables into strings
Need to construct this array manually? - Good use for a tuple? - No, in case add more valeus later
{
  inputPropAsString:<string evrsion of input prop>,
  inputPropVariable:inputPropVariable
}

*/
function transformComponentInput(rounded, size, variant) {
  //Imagine input is: rounded->full, size->md, variant->primayOutlined
  const buttonObj = buttonClass.newClassesObj.button;
  const classesObj = {};
  Object.entries(buttonObj).forEach(([HTMLLevel, propObj]) => {
    //To do: turn this into a generic loop so will work automatically regardles of the function arguments.
    //Use spread syntax as function args.
    classesObj[HTMLLevel] = propObj;

    if (propObj['rounded']) {
      classesObj[HTMLLevel]['rounded'] = rounded;
    }
    if (propObj['size']) {
      classesObj[HTMLLevel]['size'] = size;
    }
    if (propObj['variant']) {
      classesObj[HTMLLevel]['variant'] = variant;
    }

  })

  return classesObj;
}

const transformedInput = transformComponentInput('full', 'md', 'primaryOutlined');
// console.log("transformedInput below");
// console.log(transformedInput);


function transformComponentInputDynamic(inputPropObjects) {
  //Imagine input is: rounded->full, size->md, variant->primayOutlined
  const buttonObj = buttonClass.newClassesObj.button;
  const classesObj = {};
  Object.entries(buttonObj).forEach(([HTMLLevel, propObj]) => {
    classesObj[HTMLLevel] = propObj;
    inputPropObjects.forEach((inputPropObj) => {
      if (classesObj[HTMLLevel][inputPropObj.inputPropName]) {
        classesObj[HTMLLevel][inputPropObj.inputPropName] = inputPropObj.inputPropValue;
      }
    })
  })

  return classesObj;
}

const transformedArgs = [
  {
    inputPropName: 'rounded',
    inputPropValue: 'full'
  }, {
    inputPropName: 'size',
    inputPropValue: 'md'
  }, {
    inputPropName: 'variant',
    inputPropValue: 'primaryOutlined'
  },

];
const transformedInputDynamic = transformComponentInputDynamic(transformedArgs);
console.log("transformedInputDynamic below");
console.log(transformedInputDynamic);
