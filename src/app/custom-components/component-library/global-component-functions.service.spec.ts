import { TestBed } from '@angular/core/testing';

import { GlobalComponentFunctionsService } from './global-component-functions.service';

describe('GlobalComponentFunctionsService', () => {
  let service: GlobalComponentFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalComponentFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
