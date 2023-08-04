import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastContentComponent } from './toast-content.component';

describe('ToastContentComponent', () => {
  let component: ToastContentComponent;
  let fixture: ComponentFixture<ToastContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToastContentComponent]
    });
    fixture = TestBed.createComponent(ToastContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
