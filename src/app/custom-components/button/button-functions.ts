// @ts-nocheck
import { Theme } from './theme';

/* To do
- Add focus styles
*/

/*Notes
 * Do not use hover:enabled. This will not work on LinkButtons. Use 'data-[disabled=false]:* E.g. 'data-[disabled=false]:hover:bg-gray-400'
 *
 */
export class ButtonFunctions extends Theme {
  //Can define config options as class variables for extra control. By default, we keep the variant classes on disabled. However, this allows the developer to change this behaviour.
  addVariantWhenDisabled = true;
  //mode = 'dark';
  constructor(addVariantsWhenDisabled?) {
    super();
    if (addVariantsWhenDisabled) {
      this.addVariantWhenDisabled = addVariantsWhenDisabled;
    }
  }

  //container:HTMLLevel
  container = {
    disabled: {
      //isDisabled so as to avoid disabled.disabled
      isDisabled: new Set(['opacity-50', 'cursor-not-allowed']), //  isDisabled:propVariant //  'opacity-50':propClass
      isEnabled: new Set(),
    },
    default: {
      //So the dev can remove default styling which is not otherwise available via Input prop names
      //There are two kinds of defaults for each component:
      // 1. The component gets assigned default props such as isEnabled, md, primary.
      // 2. Other default props make up the button such as display:inline-flex, justify-center, etc.
      useDefault: new Set([
        'inline-flex',
        'items-center',
        'justify-center',
        'whitespace-nowrap',
      ]),
      remove: new Set(),
    },
    rounded: {
      //sm:prop name
      //always use Sets to have a consistent API.
      sm: new Set(['rounded-sm']),
      md: new Set(['rounded-md']),
      lg: new Set(['rounded-lg']),
      full: new Set(['rounded-full']),
      default: new Set(['rounded']),
    },
    size: {
      sm: new Set(['py-2', 'px-3']),
      md: new Set(['py-3', 'px-4']),
      lg: new Set(['py-4', 'px-5']),
    },

    variant: {
      plain: new Set([
        'bg-gray-300',
        'data-[disabled=false]:hover:bg-gray-400',
        'text-gray-950',
        'font-medium',
      ]),
      primary: new Set([
        'bg-purple-500',
        'data-[disabled=false]:hover:bg-purple-600',
        'text-white',
        'font-medium',
      ]),
      secondary: new Set([
        'bg-pink-500',
        'data-[disabled=false]:hover:bg-pink-600',
        'text-white',
        'font-medium',
      ]),
      primaryOutlined: new Set([
        'bg-white',
        'data-[disabled=false]:hover:bg-purple-500',
        'outline',
        'outline-2',
        'outline-purple-500',
        '-outline-offset-2',
        'text-purple-500',
        'font-medium',
        'data-[disabled=false]:hover:text-white',
      ]),
      secondaryOutlined: new Set([
        'bg-white',
        'data-[disabled=false]:hover:bg-pink-500',
        'outline',
        'outline-2',
        'outline-pink-500',
        '-outline-offset-2',
        'text-pink-500',
        'font-medium',
        'data-[disabled=false]:hover:text-white',
      ]),
    },
  };

  textContent = {
    size: {
      sm: new Set(['text-sm']), //Here sm matches text-sm. This is by chance and not necessary. sm is the prop value and text-sm is the Tailwind class.
      md: new Set(['text-md']),
      lg: new Set(['text-xl']),
    },

    variant: {
      plain: new Set(),
      primary: new Set(),
      secondary: new Set(),
      primaryOutlined: new Set(),
      secondaryOutlined: new Set([]),
    },
  };

  containerDarkVariant = {
    plain: new Set([
      'bg-gray-800',
      'data-[disabled=false]:hover:bg-gray-900',
      'text-gray-200',
      'font-medium',
    ]),
    primary: new Set([
      'bg-orange-500',
      'data-[disabled=false]:hover:bg-orange-600',
      'text-gray-800',
      'font-bold',
    ]),
    secondary: new Set([
      'bg-pink-500',
      'data-[disabled=false]:hover:bg-pink-600',
      'text-white',
      'font-medium',
    ]),
    primaryOutlined: new Set([
      'bg-white',
      'data-[disabled=false]:hover:bg-purple-500',
      'outline',
      'outline-2',
      'outline-purple-500',
      '-outline-offset-2',
      'text-purple-500',
      'font-medium',
      'data-[disabled=false]:hover:text-white',
    ]),
    secondaryOutlined: new Set([
      'bg-white',
      'data-[disabled=false]:hover:bg-pink-500',
      'outline',
      'outline-2',
      'outline-pink-500',
      '-outline-offset-2',
      'text-pink-500',
      'font-medium',
      'data-[disabled=false]:hover:text-white',
    ]),
  };

  componentLight = {
    //container, textContent, etc: represent different layers of the HTML
    container: {
      default: this.container.default,
      disabled: this.container.disabled,
      rounded: this.container.rounded,
      size: this.container.size,
      variant: this.container.variant,
    },
    textContent: {
      size: this.textContent.size,
      variant: this.textContent.variant,
    },
  };

  component = {
    //Mode in Theme refers to this level and represents dark or light theme.
    light: this.componentLight,
    dark: {
      container: {
        ...this.componentLight.container,
        variant: this.containerDarkVariant, // We only change the variant but need to copy everything else.
      },
      textContent: this.componentLight.textContent,
    },
    /* Add your own custom objects under the custom key
    custom:{
      button:{//....}
      CTAButton:{//...}
    }
    */
  };

  //This would be imported from elsewhere.
  // //To do: make sure this object cannot be manipulated from outside the class.
  // private themeObj = {
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
  //   custom:{
  //     button:{//....}
  //     CTAButton:{//...}
  //   }
  //   */
  // };
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
