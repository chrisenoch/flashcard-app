import { Theme } from './theme';

/* To do
- Add focus styles
- Each variant should have light, normal and dark versions. This is not related to light/dark theme. E.g. If pink is a variant, the developer should be able to use a light/dark pink button easily.
*/

/*Notes
 * Do not use hover:enabled. This will not work on LinkButtons. Use 'data-[disabled=false]:* E.g. 'data-[disabled=false]:hover:bg-gray-400'
 *
 */
export class ButtonFunctions extends Theme {
  //Can define config options as class variables for extra control. By default, we keep the variant classes on disabled. However, this allows the developer to change this behaviour.
  override addVariantWhenDisabled = true;

  //container:HTMLLevel
  container = {
    disabled: {
      //isDisabled so as to avoid disabled.disabled
      isDisabled: new Set(['opacity-50', 'cursor-not-allowed']), //  isDisabled:propVariant //  'opacity-50':propCSSClass
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
      //rounded:prop name
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
        ' bg-purple-500',
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
      'font-medium',
    ]),
    secondary: new Set([
      'bg-green-600',
      'data-[disabled=false]:hover:bg-green-700',
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

  override component = {
    //Mode in Theme refers to this level and represents dark or light theme.
    light: this.componentLight,
    dark: {
      container: {
        ...this.componentLight.container,
        variant: this.containerDarkVariant, // We only change the variant but we need to copy everything else.
      },
      textContent: this.componentLight.textContent,
    },
  };
}
