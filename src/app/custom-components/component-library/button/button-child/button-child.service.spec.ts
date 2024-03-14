import { TestBed } from '@angular/core/testing';

import { ButtonChildrenService } from './button-child.service';

describe('ButtonChildService', () => {
  let service: ButtonChildrenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonChildrenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
