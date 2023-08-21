import { TestBed } from '@angular/core/testing';

import { RepicesService } from './repices.service';

describe('RepicesService', () => {
  let service: RepicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
