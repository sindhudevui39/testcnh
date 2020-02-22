import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFuelReportComponent } from './fleet-fuel-report.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LoadingRingComponent } from '@shared-components/loading-ring/loading-ring.component';
import { FleetApiService } from '@fleet/services/fleet-api/fleet-api.service';
import { FleetFuelReportService } from '../../services/fleet-fuel-report/fleet-fuel-report.service';
import { UserService } from '@services/user/user.service';
import { MatSelectModule, MatOptionModule, MatCardModule } from '@angular/material';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetFuelReportComponent', () => {
  let component: FleetFuelReportComponent;
  let fixture: ComponentFixture<FleetFuelReportComponent>;
  let fleetDutyReportService: FleetFuelReportService;
  let fleetApiService: FleetApiService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule.withTranslations({}),
        MatCardModule,
        HttpClientTestingModule,
        MatOptionModule,
        MatSelectModule
      ],
      declarations: [FleetFuelReportComponent, LoadingRingComponent],
      providers: [FleetFuelReportService, UserService, FleetApiService, DatePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fleetDutyReportService = TestBed.get(FleetFuelReportService);
    fleetApiService = TestBed.get(FleetApiService);
    userService = TestBed.get(UserService);

    fixture = TestBed.createComponent(FleetFuelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
