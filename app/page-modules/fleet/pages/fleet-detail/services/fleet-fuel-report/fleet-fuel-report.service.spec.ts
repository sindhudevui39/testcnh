import { TestBed, inject } from '@angular/core/testing';

import { FleetFuelReportService } from './fleet-fuel-report.service';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetFuelReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleetFuelReportService, DatePipe],
      declarations: []
    });
  });

  it('should be created', inject([FleetFuelReportService], (service: FleetFuelReportService) => {
    expect(service).toBeTruthy();
  }));
});
