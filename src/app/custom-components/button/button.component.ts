import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ButtonFunctions } from './button-functions';
import {
  PropertyNamesAsStrings,
  initFields,
} from 'src/app/models/types/getFields';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges {
  fields!: PropertyNamesAsStrings<this>;
  constructor() {
    // this.fields = initFields<typeof this>(this, ButtonComponent);
  }
  @Input() theme: ButtonFunctions | undefined;
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

  buttonFunctions!: ButtonFunctions;
  transformedCSSInputArgs: {
    inputPropName: string;
    inputPropValue: any;
  }[] = [];
  cssClasses!: {
    container: string;
    textContent: string;
  };
  ngOnInit(): void {
    this.fields = initFields<typeof this>(this, ButtonComponent);
    if (this.theme) {
      //Use modified theme if provided. If not, use default theme.
      this.buttonFunctions = this.theme;
    } else {
      this.buttonFunctions = new ButtonFunctions();
    }

    this.updateCSSClasses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes');
    console.log('this.theme?.mode');
    console.log(this.theme?.mode);
    console.log('this.buttonFunctions.mode');
    console.log(this.buttonFunctions?.mode);
    if (this.theme) {
      //Use modified theme if provided. If not, use default theme.
      this.buttonFunctions = this.theme;
    }
    changes && console.log(changes);
    if (
      this.buttonFunctions &&
      this.buttonFunctions.checkIfCSSInputsChanged(
        changes,
        this.transformedCSSInputArgs
      )
    ) {
      this.updateCSSClasses();
    }
    if (
      changes[this.fields?.theme]?.currentValue !==
      changes[this.fields?.theme]?.previousValue
    ) {
      console.log('updating css classes');
      this.updateCSSClasses();
      console.log('new classes below');
      console.log(this.cssClasses.container);
    }
  }

  private updateCSSClasses() {
    this.transformedCSSInputArgs = this.getTransformedCSSInputArgs();
    const transformedInput = this.buttonFunctions.transformComponentInput(
      this.transformedCSSInputArgs
    );

    this.cssClasses = this.buttonFunctions.getPossiblyModifiedClassesAsStrings(
      transformedInput,
      this.disabled,
      this.sx
    ) as {
      container: string;
      textContent: string;
    };
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
