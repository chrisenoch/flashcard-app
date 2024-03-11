import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideControllerComponent } from './slide-controller.component';

describe('SlideControllerComponent', () => {
  let component: SlideControllerComponent;
  let fixture: ComponentFixture<SlideControllerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideControllerComponent]
    });
    fixture = TestBed.createComponent(SlideControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
