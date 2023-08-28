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
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { WordSlideComponent } from './slides/word-slide/word-slide.component';
import { SummarySlideComponent } from './slides/summary-slide/summary-slide.component';
import ExerciseSlideComponent from './slides/exercise-slide/exercise-slide.component';
import { MainNavComponent } from './layout/main-nav/main-nav.component';
import { NoTeachingItemsErrorComponent } from './errors/no-teaching-items-error/no-teaching-items-error.component';
import { NoSlideErrorComponent } from './errors/no-slide-error/no-slide-error.component';
import { SlideOptionBarComponent } from './menu/slide-option-bar/slide-option-bar.component';
import { AccordionComponent } from './custom-components/accordion/accordion.component';
import { AccordionTabComponent } from './custom-components/accordion/accordion-tab/accordion-tab.component';
import { ToastComponent } from './custom-components/toast/toast.component';
import { ToastContentComponent } from './layout/main-nav/toast-content/toast-content.component';
import { ToastDirective } from './custom-components/toast/toast.directive';
import { ElementControlsDirective } from './custom-components/element-controls.directive';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    WordSlideComponent,
    SummarySlideComponent,
    ExerciseSlideComponent,
    MainNavComponent,
    NoTeachingItemsErrorComponent,
    NoSlideErrorComponent,
    SlideOptionBarComponent,
    AccordionComponent,
    AccordionTabComponent,
    ToastComponent,
    ToastContentComponent,
    ToastDirective,

    ElementControlsDirective,
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
