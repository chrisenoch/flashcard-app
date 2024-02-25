import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTeachingEntitiesErrorComponent } from './no-teaching-entities-error.component';

describe('NoTeachingEntitiesErrorComponent', () => {
  let component: NoTeachingEntitiesErrorComponent;
  let fixture: ComponentFixture<NoTeachingEntitiesErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoTeachingEntitiesErrorComponent]
    });
    fixture = TestBed.createComponent(NoTeachingEntitiesErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
