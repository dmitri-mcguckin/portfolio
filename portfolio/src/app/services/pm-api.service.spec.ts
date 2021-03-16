import { TestBed } from '@angular/core/testing';

import { PmApiService } from './pm-api.service';

describe('PmApiService', () => {
  let service: PmApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
