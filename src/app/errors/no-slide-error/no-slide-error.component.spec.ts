import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSlideErrorComponent } from './no-slide-error.component';

describe('NoSlideErrorComponent', () => {
  let component: NoSlideErrorComponent;
  let fixture: ComponentFixture<NoSlideErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoSlideErrorComponent]
    });
    fixture = TestBed.createComponent(NoSlideErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
