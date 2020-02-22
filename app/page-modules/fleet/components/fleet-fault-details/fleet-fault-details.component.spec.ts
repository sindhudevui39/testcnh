import { async, TestBed } from '@angular/core/testing';

import { FleetFaultDetailsComponent } from './fleet-fault-details.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { CapitalizeFirstPipe } from 'src/app/shared/Pipes/capitalize-first.pipe';
import { UserService } from '@services/user/user.service';
import { MatDialogModule } from '@angular/material';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';
import { FleetService } from '@fleet/services/fleet.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetFaultDetailsComponent', () => {
  let userService: UserService;
  let toggleFilterBarService: ToolbarToggleFilterbarService;
  let fleetService: FleetService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        PerfectScrollbarModule,
        HttpClientTestingModule,
        MatDialogModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [FleetFaultDetailsComponent, CapitalizeFirstPipe],
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
        FleetService,
        ToolbarToggleFilterbarService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);

    toggleFilterBarService = TestBed.get(ToolbarToggleFilterbarService);
    fleetService = TestBed.get(FleetService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetFaultDetailsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
