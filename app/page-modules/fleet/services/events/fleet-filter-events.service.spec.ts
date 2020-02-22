import { TestBed, inject } from '@angular/core/testing';

import { FleetFilterEventsService } from './fleet-filter-events.service';
import { HttpClientModule } from '@angular/common/http';

describe('FleetFilterEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        FleetFilterEventsService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    });
  });

  it('should be created', inject(
    [FleetFilterEventsService],
    (service: FleetFilterEventsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
