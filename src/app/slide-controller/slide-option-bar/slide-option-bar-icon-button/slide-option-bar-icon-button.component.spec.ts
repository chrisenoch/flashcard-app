import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideOptionBarIconButtonComponent } from './slide-option-bar-icon-button.component';

describe('SlideOptionBarIconButtonComponent', () => {
  let component: SlideOptionBarIconButtonComponent;
  let fixture: ComponentFixture<SlideOptionBarIconButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideOptionBarIconButtonComponent]
    });
    fixture = TestBed.createComponent(SlideOptionBarIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
