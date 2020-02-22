import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFaultsComponent } from './fleet-faults.component';
import { CollapsibleSideNavComponent } from '@fleet/components/collapsible-side-nav/collapsible-side-nav.component';
import { FaultsListHeaderComponent } from './components/faults-list-header/faults-list-header.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatIconModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { FleetVehicleListComponent } from '@fleet/components/fleet-vehicle-list/fleet-vehicle-list.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';
import { FleetService } from '@fleet/services/fleet.service';
import { UserService } from '@services/user/user.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { user } from 'src/app/test-constants/User';

describe('FleetFaultsComponent', () => {
  let route: ActivatedRoute;
  let fleetService: FleetService;
  let faultsFilterDataService: FaultsFilterDataService;
  let userService: UserService;
  let fleetFilterDataStoreService: FleetFilterDataStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        PerfectScrollbarModule,
        MatSelectModule,
        MatIconModule,
        MatOptionModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetFaultsComponent,
        DropdownComponent,
        CollapsibleSideNavComponent,
        FaultsListHeaderComponent,
        LoaderComponent,
        FleetVehicleListComponent,
        SearchHighlightPipe
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {}
          }
        },
        FaultsFilterDataService,
        FleetService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    fleetFilterDataStoreService = TestBed.get(FleetFilterDataStoreService);
    fleetFilterDataStoreService._userService.user['isDealer'] = userService.user['isDealer'];

    route = TestBed.get(ActivatedRoute);
    fleetService = TestBed.get(FleetService);
    faultsFilterDataService = TestBed.get(FaultsFilterDataService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetFaultsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
