import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourGuideContentComponent } from './tour-guide-content.component';

describe('TourGuideContentComponent', () => {
  let component: TourGuideContentComponent;
  let fixture: ComponentFixture<TourGuideContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourGuideContentComponent]
    });
    fixture = TestBed.createComponent(TourGuideContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
