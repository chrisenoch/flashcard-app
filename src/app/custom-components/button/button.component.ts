import {
  Component,
  DoCheck,
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
import { ButtonService } from './button.service';
import { GlobalComponentFunctionsService } from './global-component-functions.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges {
  fields: PropertyNamesAsStrings<this>;
  multiPropCSSInputArgsToCheckIfChanged: {
    inputPropName: string;
    inputPropValue: any;
  }[] = [];
  constructor(
    protected buttonService: ButtonService,
    protected globalComponentFunctions: GlobalComponentFunctionsService
  ) {
    this.fields = initFields<typeof this>(this, ButtonComponent);
    this.initMultiPropCSSInputArgsToCheckIfChanged();
  }

  @Input() theme: ButtonFunctions | undefined = undefined;
  @Input() default: 'remove' | 'useDefault' = 'useDefault';
  @Input() href: string | undefined = undefined;
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
    | undefined = undefined;

  @Input() variant:
    | 'plain'
    | 'primary'
    | 'secondary'
    | 'primaryOutlined'
    | 'secondaryOutlined' = 'primary';

  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() rounded: 'sm' | 'md' | 'lg' | 'full' | 'default' = 'md';
  @Input('disabled') set disabledInitOnly(isDisabled: boolean) {
    this.disabled = isDisabled ? 'isDisabled' : 'isEnabled';
  }
  disabled: 'isDisabled' | 'isEnabled' = 'isEnabled';
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
    if (this.theme) {
      //Use modified theme if provided. If not, use default theme.
      this.buttonFunctions = this.theme;
    } else {
      this.buttonFunctions = this.initButton();
    }
    this.updateCSSClasses();
    this.globalComponentFunctions.mode$.subscribe((mode) => {
      this.buttonFunctions.mode = mode;
      this.updateCSSClasses();
    });
  }

  initButton() {
    return this.buttonService.getButtonFunctions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.theme) {
      //Update modified theme if provided. If not, use default theme.
      this.buttonFunctions = this.theme;
    }
    if (
      this.buttonFunctions &&
      (this.buttonFunctions.checkIfInputsChanged(
        changes,
        this.transformedCSSInputArgs
      ) ||
        this.buttonFunctions.checkIfInputsChanged(
          changes,
          this.multiPropCSSInputArgsToCheckIfChanged
        ))
    ) {
      console.log('about to update css props for ' + this.buttonText);
      this.updateCSSClasses();
    }
  }

  protected updateCSSClasses() {
    this.transformedCSSInputArgs = this.getTransformedCSSInputArgs();
    const transformedInput = this.buttonFunctions.transformComponentInput(
      this.transformedCSSInputArgs
    );

    this.cssClasses = this.buttonFunctions.getCSSClassesStringByHTMLLevel(
      transformedInput,
      this.disabled,
      this.sx
    ) as {
      container: string;
      textContent: string;
    };
  }

  //Only include theme and sx prop here.
  private initMultiPropCSSInputArgsToCheckIfChanged() {
    this.multiPropCSSInputArgsToCheckIfChanged.push({
      inputPropName: this.fields.theme,
      inputPropValue: this.theme,
    });
    this.multiPropCSSInputArgsToCheckIfChanged.push({
      inputPropName: this.fields.sx,
      inputPropValue: this.sx,
    });
    this.multiPropCSSInputArgsToCheckIfChanged.push({
      inputPropName: this.fields.disabledInitOnly,
      inputPropValue: this.disabledInitOnly,
    });
  }

  extraCSSInputArgs(): any {
    return [];
  }

  //Do not add "Theme" or "sx" here.
  protected getTransformedCSSInputArgs(): {
    inputPropName: string;
    inputPropValue: string;
  }[] {
    return [
      ...this.extraCSSInputArgs(),
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
