import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourGuideDemoComponent } from './tour-guide-demo.component';

describe('TourGuideDemoComponent', () => {
  let component: TourGuideDemoComponent;
  let fixture: ComponentFixture<TourGuideDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourGuideDemoComponent]
    });
    fixture = TestBed.createComponent(TourGuideDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
