import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSlideComponent } from './word-slide.component';

describe('WordSlideComponent', () => {
  let component: WordSlideComponent;
  let fixture: ComponentFixture<WordSlideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordSlideComponent]
    });
    fixture = TestBed.createComponent(WordSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
