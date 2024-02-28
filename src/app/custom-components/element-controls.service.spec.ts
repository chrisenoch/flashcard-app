import { TestBed } from '@angular/core/testing';

import { ElementControlsService } from './element-controls.service';

describe('ElementControlsService', () => {
  let service: ElementControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
