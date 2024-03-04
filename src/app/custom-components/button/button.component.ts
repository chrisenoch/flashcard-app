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
  @Input() buttonText = '';
  @Input() sx:
    | {
        container?: {
          add?: string[];
          remove?: string[];
        };
        textContent?: {
          add?: string[];
          remove?: string[];
        };
      }
    | undefined;

  @Input() variant:
    | 'primary'
    | 'secondary'
    | 'primaryOutlined'
    | 'secondaryOutlined' = 'primary';

  @Input() size: 'sm' | 'md' = 'md';
  @Input() rounded: 'sm' | 'md' | 'full' = 'md';
  @Input() disabled: 'isDisabled' | 'isEnabled' = 'isEnabled';

  transformedCSSInputArgs: {
    inputPropName: string;
    inputPropValue: any;
  }[] = [];
  ngOnInit(): void {
    this.transformedCSSInputArgs = [
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
    ];

    const transformedInput = this.buttonFunctions.transformComponentInput(
      this.transformedCSSInputArgs
    );
    const cssClassesByHTMLLevel =
      this.buttonFunctions.getPossiblyModifiedClassesAsStrings(
        transformedInput,
        this.sx
      );

    console.log('ngOnInit cssClassesByHTMLLevel below');
    console.log(cssClassesByHTMLLevel);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('in ngonchanges');
    if (this.checkIfCSSInputsChanged(changes)) {
      console.log('ran ngChanges inside if');
      //update css classes
      const transformedInput = this.buttonFunctions.transformComponentInput([
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
      ]);
      const cssClassesByHTMLLevel =
        this.buttonFunctions.getPossiblyModifiedClassesAsStrings(
          transformedInput,
          this.sx
        );

      console.log('ngOnChanges cssClassesByHTMLLevel below');
      console.log(cssClassesByHTMLLevel);
    }
  }

  // containerCSS = '';
  // textContentCSS = '';

  private checkIfCSSInputsChanged(changes: SimpleChanges) {
    console.log('in checkcssinputsifchanged');
    let haveChanged = false;
    console.log(this.transformedCSSInputArgs.length);
    for (let i = 0; i < this.transformedCSSInputArgs.length; i++) {
      const inputPropName = this.transformedCSSInputArgs[i].inputPropName;
      console.log('curr ');
      console.log(changes[inputPropName].currentValue);
      console.log('prev ');
      console.log(changes[inputPropName].previousValue);
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
}
