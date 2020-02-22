import { TestBed, inject } from '@angular/core/testing';

import { FleetApiService } from './fleet-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleetApiService]
    });
  });

  it('should be created', inject([FleetApiService], (service: FleetApiService) => {
    expect(service).toBeTruthy();
  }));
});
