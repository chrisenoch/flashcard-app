import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovableAlertComponent } from './removable-alert.component';

describe('RemovableAlertComponent', () => {
  let component: RemovableAlertComponent;
  let fixture: ComponentFixture<RemovableAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemovableAlertComponent]
    });
    fixture = TestBed.createComponent(RemovableAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
