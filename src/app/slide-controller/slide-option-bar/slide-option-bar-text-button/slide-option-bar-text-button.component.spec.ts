import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideOptionBarTextButtonComponent } from './slide-option-bar-text-button.component';

describe('SlideOptionBarTextButtonComponent', () => {
  let component: SlideOptionBarTextButtonComponent;
  let fixture: ComponentFixture<SlideOptionBarTextButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideOptionBarTextButtonComponent]
    });
    fixture = TestBed.createComponent(SlideOptionBarTextButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
