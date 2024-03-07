import { TestBed } from '@angular/core/testing';

import { ButtonChildService } from './button-child.service';

describe('ButtonChildService', () => {
  let service: ButtonChildService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonChildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
