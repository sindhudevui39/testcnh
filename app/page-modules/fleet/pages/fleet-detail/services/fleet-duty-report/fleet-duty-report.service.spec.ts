import { TestBed, inject } from '@angular/core/testing';

import { FleetDutyReportService } from './fleet-duty-report.service';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetDutyReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleetDutyReportService, DatePipe]
    });
  });

  it('should be created', inject([FleetDutyReportService], (service: FleetDutyReportService) => {
    expect(service).toBeTruthy();
  }));
});
