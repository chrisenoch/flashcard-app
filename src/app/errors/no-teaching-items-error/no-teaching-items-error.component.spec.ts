import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTeachingItemsErrorComponent } from './no-teaching-items-error.component';

describe('NoTeachingItemsErrorComponent', () => {
  let component: NoTeachingItemsErrorComponent;
  let fixture: ComponentFixture<NoTeachingItemsErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoTeachingItemsErrorComponent]
    });
    fixture = TestBed.createComponent(NoTeachingItemsErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
