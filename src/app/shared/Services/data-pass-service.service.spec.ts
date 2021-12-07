import { TestBed } from '@angular/core/testing';

import { DataPassServiceService } from './data-pass-service.service';

describe('DataPassServiceService', () => {
  let service: DataPassServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataPassServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
