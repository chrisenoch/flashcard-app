import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySlideComponent } from './summary-slide.component';

describe('SummarySlideComponent', () => {
  let component: SummarySlideComponent;
  let fixture: ComponentFixture<SummarySlideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummarySlideComponent]
    });
    fixture = TestBed.createComponent(SummarySlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
