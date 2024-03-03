//TO DO
//How to handle disabled?
//If disabled do not return certian values, liek primary colours. Also, set cursor to not-allowed.
//Default values?
//How deal with if outlined or not? - Separate entirely?
//How get the classes

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

  getClassesAsStrings(desiredClassesObj) {
    const classesSets = this.getClassesAsSets(desiredClassesObj);
    const returnObject = {};
    Object.entries(classesSets).forEach(([HTMLLevel, theSet]) => {
      returnObject[HTMLLevel] = this.getClasses(classesSets[HTMLLevel]);
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
}

const myArgs = {
  container: {
    rounded: 'full',
    size: 'md',
    variant: 'primaryOutlined'
  },
  textContent: {
    size: 'md',
    variant: 'primary'
  }
}

const buttonClass = new ButtonFunctions();
const classesAsSets = buttonClass.getClassesAsSets(myArgs);
//returns the HTMLLevel:Set of classnames
console.log(classesAsSets);

const classesAsStrings = buttonClass.getClassesAsStrings(myArgs);
console.log(classesAsStrings);

//1. Now IN A DIFFERENT FUNCTION I need to convert it into a string of class names so I can apply to the button
//2. Another function in the class that wraps getClasses. Before returning the final classnames, executes the developer callback.
//Callback, could be addClasses, editClasses, etc.
//Would need a callback for each HTM Level



