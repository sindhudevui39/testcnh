import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetToolbarComponent } from './fleet-toolbar.component';
import { FleetToolbarDisplayInfoComponent } from './fleet-toolbar-display-info/fleet-toolbar-display-info.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SearchComponent } from '@shared-components/search/search.component';
import { MatButtonToggleModule, MatIconModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FleetFilterBarComponent } from './filters/fleet-filter-bar/fleet-filter-bar.component';
import { FaultFilterBarComponent } from './filters/fault-filter-bar/fault-filter-bar.component';
import { FilterDropdownComponent } from '@shared-components/filters/filter-dropdown/filter-dropdown.component';
import { FilterDropdownLabelComponent } from '@shared-components/filters/filter-dropdown-label/filter-dropdown-label.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { UserService } from '@services/user/user.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { user } from 'src/app/test-constants/User';
import { NavmapService } from '@fleet/services/navmap.service';
import { FleetFilterEventsService } from '@fleet/services/events/fleet-filter-events.service';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';
import { Router } from '@angular/router';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FleetToolbarService } from '@services/fleet-toolbar/fleet-toolbar.service';
import { LoaderComponent } from '@shared-modules/loading/loader.component';

describe('FleetToolbarComponent', () => {
  let userService: UserService;
  let fleetFilterDataStoreService: FleetFilterDataStoreService;
  let fleetToolbarService: FleetToolbarService;
  let _filterEventsService: FleetFilterEventsService;
  let _toggleFilterBar: ToolbarToggleFilterbarService;
  let _router: Router;
  let faultsDataStore: FaultsFilterDataService;
  let navMapService: NavmapService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonToggleModule,
        PerfectScrollbarModule,
        HttpClientTestingModule,
        AppRoutingModule,
        MatIconModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetToolbarComponent,
        FleetFilterBarComponent,
        FaultFilterBarComponent,
        FilterDropdownComponent,
        FleetToolbarDisplayInfoComponent,
        SearchComponent,
        FilterDropdownLabelComponent,
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
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    fleetFilterDataStoreService = TestBed.get(FleetFilterDataStoreService);
    fleetFilterDataStoreService._userService.user = userService.user;

    fleetToolbarService = TestBed.get(FleetToolbarService);
    _filterEventsService = TestBed.get(FleetFilterEventsService);
    _toggleFilterBar = TestBed.get(ToolbarToggleFilterbarService);
    _router = TestBed.get(Router);

    faultsDataStore = TestBed.get(FaultsFilterDataService);
    navMapService = TestBed.get(NavmapService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetToolbarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
