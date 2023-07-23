import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideOptionBarComponent } from './slide-option-bar.component';

describe('SlideOptionBarComponent', () => {
  let component: SlideOptionBarComponent;
  let fixture: ComponentFixture<SlideOptionBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideOptionBarComponent]
    });
    fixture = TestBed.createComponent(SlideOptionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
