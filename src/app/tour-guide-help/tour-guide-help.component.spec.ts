import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourGuideHelpComponent } from './tour-guide-help.component';

describe('TourGuideHelpComponent', () => {
  let component: TourGuideHelpComponent;
  let fixture: ComponentFixture<TourGuideHelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourGuideHelpComponent]
    });
    fixture = TestBed.createComponent(TourGuideHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
