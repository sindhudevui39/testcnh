import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetDutyReportComponent } from './fleet-duty-report.component';
import { FleetDutyReportService } from '../../services/fleet-duty-report/fleet-duty-report.service';
import { FleetApiService } from '@fleet/services/fleet-api/fleet-api.service';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LoadingRingComponent } from '@shared-components/loading-ring/loading-ring.component';
import { MatCardModule } from '@angular/material';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetDutyReportComponent', () => {
  let component: FleetDutyReportComponent;
  let fixture: ComponentFixture<FleetDutyReportComponent>;
  let fleetDutyReportService: FleetDutyReportService;
  let fleetApiService: FleetApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule.withTranslations({}),
        HttpClientTestingModule,
        MatCardModule
      ],
      declarations: [FleetDutyReportComponent, LoadingRingComponent],
      providers: [FleetDutyReportService, FleetApiService, DatePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fleetDutyReportService = TestBed.get(FleetDutyReportService);
    fleetApiService = TestBed.get(FleetApiService);
    fixture = TestBed.createComponent(FleetDutyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
