import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourGuideContainerComponent } from './tour-guide-container.component';

describe('TourGuideContainerComponent', () => {
  let component: TourGuideContainerComponent;
  let fixture: ComponentFixture<TourGuideContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourGuideContainerComponent]
    });
    fixture = TestBed.createComponent(TourGuideContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
