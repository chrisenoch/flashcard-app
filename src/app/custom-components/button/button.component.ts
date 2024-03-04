import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ButtonFunctions } from './button-functions';
import { initFields } from 'src/app/models/types/getFields';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges {
  buttonFunctions;
  fields;
  constructor() {
    this.buttonFunctions = new ButtonFunctions();
    this.fields = initFields<typeof this>(this, ButtonComponent);
  }
  @Input() default: 'remove' | 'useDefault' = 'useDefault';
  @Input() href: string | undefined;
  @Input() buttonText = '';
  @Input() sx:
    | {
        container?: {
          add?: string | string[];
          remove?: string | string[];
        };
        textContent?: {
          add?: string | string[];
          remove?: string | string[];
        };
      }
    | undefined;

  @Input() variant:
    | 'plain'
    | 'primary'
    | 'secondary'
    | 'primaryOutlined'
    | 'secondaryOutlined' = 'primary';

  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() rounded: 'sm' | 'md' | 'lg' | 'full' | 'default' = 'md';
  @Input() disabled: 'isDisabled' | 'isEnabled' = 'isEnabled';

  transformedCSSInputArgs: {
    inputPropName: string;
    inputPropValue: any;
  }[] = [];
  cssClasses!: {
    container: string;
    textContent: string;
  };
  classesToAddIfDisabled!: string;
  ngOnInit(): void {
    this.updateCSSClasses();

    console.log('this.disabledClasses');
    console.log(this.classesToAddIfDisabled);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.checkIfCSSInputsChanged(changes)) {
      this.updateCSSClasses();
    }
  }

  private updateCSSClasses() {
    this.classesToAddIfDisabled =
      this.buttonFunctions.getDisabledClassesAsString().container; //Needed to add disabled state to link button. Link needs help because <a> tag does not have disabled attribute.
    this.transformedCSSInputArgs = this.getTransformedCSSInputArgs();
    const transformedInput = this.buttonFunctions.transformComponentInput(
      this.transformedCSSInputArgs
    );

    this.cssClasses = this.buttonFunctions.getPossiblyModifiedClassesAsStrings(
      transformedInput,
      this.sx
    ) as {
      container: string;
      textContent: string;
    };

    const classesToRemoveIfDisabled =
      this.buttonFunctions.getTheme().buttonConfig.classesToRemoveIfDisabled;
    console.log('classesToRemoveIfDisabled');
    console.log(classesToRemoveIfDisabled);
    //To do: Need to be more specific. I know it is the container, but this needs to be automatic.
    if (this.disabled === 'isDisabled') {
      const containerCSS = this.cssClasses.container;
      //get the spaced strings as a Set
      const containerCSSSet = new Set(
        containerCSS.split(' ').filter((item) => item.length > 0)
      );
      //remove unwanted css classes
      classesToRemoveIfDisabled.forEach((cssClass) => {
        containerCSSSet.delete(cssClass);
      });
      this.cssClasses.container =
        this.buttonFunctions.setToSpacedString(containerCSSSet);

      console.log('this.cssClasses.containerclasses when button disabled');
      console.log(this.cssClasses.container);
    }
  }

  private checkIfCSSInputsChanged(changes: SimpleChanges) {
    let haveChanged = false;
    for (let i = 0; i < this.transformedCSSInputArgs.length; i++) {
      const inputPropName = this.transformedCSSInputArgs[i].inputPropName;
      if (
        changes[inputPropName].currentValue !==
        changes[inputPropName].previousValue
      ) {
        haveChanged = true;
        break;
      }
    }
    return haveChanged;
  }

  private getTransformedCSSInputArgs() {
    return [
      {
        inputPropName: this.fields.rounded,
        inputPropValue: this.rounded,
      },
      {
        inputPropName: this.fields.size,
        inputPropValue: this.size,
      },

      {
        inputPropName: this.fields.variant,
        inputPropValue: this.variant,
      },

      {
        inputPropName: this.fields.disabled,
        inputPropValue: this.disabled,
      },
      {
        inputPropName: this.fields.default,
        inputPropValue: this.default,
      },
    ];
  }
}
