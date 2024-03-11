import { Component } from '@angular/core';
import { ButtonFunctions } from 'src/app/custom-components/button/button-functions';
import { ButtonService } from 'src/app/custom-components/button/button.service';
import { GlobalComponentFunctionsService } from 'src/app/custom-components/button/global-component-functions.service';

@Component({
  selector: 'app-component-library',
  templateUrl: './component-library.component.html',
  styleUrls: ['./component-library.component.scss'],
})
export class ComponentLibraryComponent {
  customisedBtn = new ButtonFunctions();
  newPrimary = new Set([
    'bg-blue-700',
    'data-[disabled=false]:hover:bg-blue-800',
    'text-orange-100',
  ]);

  constructor(
    private globalComponentFunctionsService: GlobalComponentFunctionsService,
    private buttonService: ButtonService
  ) {
    this.customisedBtn.container.variant.primary = this.newPrimary;
  }

  toggleGlobalMode() {
    if (this.buttonService.buttonFunctions.mode === 'dark') {
      this.globalComponentFunctionsService.updateMode('light');
    } else {
      this.globalComponentFunctionsService.updateMode('dark');
    }
  }

  setGlobalModeToLight() {
    this.globalComponentFunctionsService.updateMode('light');
  }

  setGlobalModeToDark() {
    this.globalComponentFunctionsService.updateMode('dark');
  }

  toggleNestedMode() {
    if (this.customisedBtn.mode === 'dark') {
      this.updateCustomBtnMode('light');
    } else {
      this.updateCustomBtnMode('dark');
    }
  }

  private updateCustomBtnMode(mode: 'dark' | 'light') {
    //Object reference needs to change or changes not picked up.
    const newCustomisedBtn = new ButtonFunctions();
    newCustomisedBtn.container.variant.primary = this.newPrimary;
    this.customisedBtn = newCustomisedBtn;
    this.customisedBtn.mode = mode;
  }
}
