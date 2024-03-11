import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourGuideHelpActionBarComponent } from './tour-guide-help-action-bar.component';

describe('TourGuideHelpActionBarComponent', () => {
  let component: TourGuideHelpActionBarComponent;
  let fixture: ComponentFixture<TourGuideHelpActionBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourGuideHelpActionBarComponent]
    });
    fixture = TestBed.createComponent(TourGuideHelpActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
