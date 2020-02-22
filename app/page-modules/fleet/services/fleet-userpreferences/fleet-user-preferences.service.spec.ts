import { TestBed, inject } from '@angular/core/testing';

import { FleetUserPreferencesService } from './fleet-user-preferences.service';
import { HttpClientModule } from '@angular/common/http';

describe('FleetUserPreferencesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        FleetUserPreferencesService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    });
  });

  it('should be created', inject(
    [FleetUserPreferencesService],
    (service: FleetUserPreferencesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
