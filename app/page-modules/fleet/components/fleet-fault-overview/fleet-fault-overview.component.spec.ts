import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFaultOverviewComponent } from './fleet-fault-overview.component';
import { FleetFaultDetailsComponent } from '../fleet-fault-details/fleet-fault-details.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { CapitalizeFirstPipe } from 'src/app/shared/Pipes/capitalize-first.pipe';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';
import { MatDialogModule } from '@angular/material';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';

describe('FleetFaultOverviewComponent', () => {
  let userService: UserService;
  let faultsFilterDataService: FaultsFilterDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        PerfectScrollbarModule,
        HttpClientModule,
        MatDialogModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetFaultOverviewComponent,
        CapitalizeFirstPipe,
        FleetFaultDetailsComponent,
        LoaderComponent
      ],
      providers: [
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        UserService,
        FaultsFilterDataService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    faultsFilterDataService = TestBed.get(FaultsFilterDataService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetFaultOverviewComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
