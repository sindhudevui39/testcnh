import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFaultListComponent } from './fleet-fault-list.component';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';
import { FleetService } from '@fleet/services/fleet.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FleetFaultDetailsComponent } from '../fleet-fault-details/fleet-fault-details.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CapitalizeFirstPipe } from 'src/app/shared/Pipes/capitalize-first.pipe';
import { UserService } from '@services/user/user.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { user } from 'src/app/test-constants/User';
import { MatDialogModule } from '@angular/material';

describe('FleetFaultListComponent', () => {
  let fleetService: FleetService;
  let faultsFilterDataService: FaultsFilterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        HttpClientModule,
        MatDialogModule,
        PerfectScrollbarModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetFaultListComponent,
        CapitalizeFirstPipe,
        FleetFaultDetailsComponent,
        LoaderComponent
      ],
      providers: [
        FaultsFilterDataService,
        FleetService,
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    faultsFilterDataService = TestBed.get(FaultsFilterDataService);
    fleetService = TestBed.get(FleetService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetFaultListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
