import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authInverseGuard } from './auth-inverse.guard';

describe('authInverseGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authInverseGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
