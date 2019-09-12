import { TestBed } from '@angular/core/testing';

import { ApiAccessService } from './api-access.service';

describe('ApiAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiAccessService = TestBed.get(ApiAccessService);
    expect(service).toBeTruthy();
  });
});
