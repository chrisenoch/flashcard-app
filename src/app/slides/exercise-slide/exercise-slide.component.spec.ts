import { ComponentFixture, TestBed } from '@angular/core/testing';

import ExerciseSlideComponent from './exercise-slide.component';

describe('ExerciseSlideComponent', () => {
  let component: ExerciseSlideComponent;
  let fixture: ComponentFixture<ExerciseSlideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciseSlideComponent],
    });
    fixture = TestBed.createComponent(ExerciseSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
