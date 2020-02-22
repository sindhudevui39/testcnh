import { TestBed, inject } from '@angular/core/testing';
import { FleetOverviewService } from './fleet-overview.service';
import { HttpClientModule } from '@angular/common/http';

describe('FleetOverviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        FleetOverviewService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    });
  });

  it('should be created', inject([FleetOverviewService], (service: FleetOverviewService) => {
    expect(service).toBeTruthy();
  }));
});
