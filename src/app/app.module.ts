import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { WordSlideComponent } from './slides/word-slide/word-slide.component';
import { SummarySlideComponent } from './slides/summary-slide/summary-slide.component';
import ExerciseSlideComponent from './slides/exercise-slide/exercise-slide.component';
import { MainNavComponent } from './layout/main-nav/main-nav.component';
import { NoSlideErrorComponent } from './errors/no-slide-error/no-slide-error.component';
import { SlideOptionBarComponent } from './slide-controller/slide-option-bar/slide-option-bar.component';
import { AccordionComponent } from './custom-components/accordion/accordion.component';
import { AccordionTabComponent } from './custom-components/accordion/accordion-tab/accordion-tab.component';
import { NoTeachingEntitiesErrorComponent } from './errors/no-teaching-entities-error/no-teaching-entities-error.component';
import { SlideControllerComponent } from './slide-controller/slide-controller.component';
import { ElementControlsDirective } from './custom-components/element-controls.directive';
import { TourGuideComponent } from './custom-components/tour-guide/tour-guide.component';
import { TourGuideDirective } from './custom-components/tour-guide/tour-guide.directive';
import { TourGuideHelpComponent } from './tour-guide-help/tour-guide-help.component';
import { TourGuideHelpActionBarComponent } from './tour-guide-help-action-bar/tour-guide-help-action-bar.component';
import { TourGuideContainerComponent } from './custom-components/tour-guide/tour-guide-container/tour-guide-container.component';
import { SlideOptionBarTextButtonComponent } from './slide-controller/slide-option-bar/slide-option-bar-text-button/slide-option-bar-text-button.component';
import { SlideOptionBarIconButtonComponent } from './slide-controller/slide-option-bar/slide-option-bar-icon-button/slide-option-bar-icon-button.component';
import { DisableLinkDirective } from './custom-directives/disable-link.directive';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { DefaultClassesDirective } from './custom-directives/default-classes.directive';
import { InheritTestDirective } from './custom-directives/inherit-test.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WordSlideComponent,
    SummarySlideComponent,
    ExerciseSlideComponent,
    MainNavComponent,
    NoSlideErrorComponent,
    SlideOptionBarComponent,
    AccordionComponent,
    AccordionTabComponent,
    NoTeachingEntitiesErrorComponent,
    SlideControllerComponent,
    ElementControlsDirective,
    TourGuideComponent,
    TourGuideDirective,
    TourGuideHelpComponent,
    TourGuideHelpActionBarComponent,
    TourGuideContainerComponent,
    SlideOptionBarTextButtonComponent,
    SlideOptionBarIconButtonComponent,
    DisableLinkDirective,

    MainLayoutComponent,
      SignInComponent,
      DefaultClassesDirective,
      InheritTestDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    MultiSelectModule,
    PanelMenuModule,
    InputTextModule,
    AccordionModule,
    CalendarModule,
    MenubarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
