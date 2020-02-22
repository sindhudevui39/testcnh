import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetComponent } from './fleet.component';
import { FleetToolbarComponent } from './components/fleet-toolbar/fleet-toolbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RemoteDisplayViewComponent } from '@shared-components/remote-display-view/remote-display-view.component';
import { FleetNotificationToolbarComponent } from './pages/fleet-notifications/components/fleet-notification-toolbar/fleet-notification-toolbar.component';
import { NavmapService } from './services/navmap.service';
import { FleetDataService } from './services/fleet-data.service';
import { UserService } from '@services/user/user.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FleetPostNotificationService } from './pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { EvoSocketService } from '@services/evo-socket/evo-socket.service';
import { FleetService } from './services/fleet.service';
import { FleetToolbarDisplayInfoComponent } from './components/fleet-toolbar/fleet-toolbar-display-info/fleet-toolbar-display-info.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SearchComponent } from '@shared-components/search/search.component';
import {
  MatButtonToggleModule,
  MatIconModule,
  MatDialogModule,
  MatSnackBarModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FleetFilterBarComponent } from './components/fleet-toolbar/filters/fleet-filter-bar/fleet-filter-bar.component';
import { FaultFilterBarComponent } from './components/fleet-toolbar/filters/fault-filter-bar/fault-filter-bar.component';
import { FilterDropdownComponent } from '@shared-components/filters/filter-dropdown/filter-dropdown.component';
import { FilterDropdownLabelComponent } from '@shared-components/filters/filter-dropdown-label/filter-dropdown-label.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { FleetFilterDataStoreService } from './services/fleet-filter-data-store/fleet-filter-data-store.service';
import { user } from 'src/app/test-constants/User';

describe('FleetComponent', () => {
  let userService: UserService;
  let fleetFilterDataStoreService: FleetFilterDataStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatButtonToggleModule,
        HttpClientModule,
        FormsModule,
        PerfectScrollbarModule,
        MatIconModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetComponent,
        FleetToolbarComponent,
        FleetNotificationToolbarComponent,
        RemoteDisplayViewComponent,
        FleetToolbarDisplayInfoComponent,
        SearchComponent,
        FleetFilterBarComponent,
        FaultFilterBarComponent,
        FilterDropdownComponent,
        FilterDropdownLabelComponent
      ],
      providers: [
        NavmapService,
        FleetDataService,
        UserService,
        TranslateService,
        FleetPostNotificationService,
        EvoSocketService,
        {
          provide: 'window',
          useValue: window
        },
        FleetService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    fleetFilterDataStoreService = TestBed.get(FleetFilterDataStoreService);
    fleetFilterDataStoreService._userService.user = userService.user;
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
