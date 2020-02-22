import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleSideNavComponent } from './collapsible-side-nav.component';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';
import { ApiService } from '@services/api/api.service';
import { FleetService } from '@fleet/services/fleet.service';
import { SelectedVehicleService } from '@fleet/services/events/selected-vehicle.service';
import { FleetDataService } from '@fleet/services/fleet-data.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { UtilService } from '@services/util/util.service';
import { UserService } from '@services/user/user.service';
import { NavmapService } from '@fleet/services/navmap.service';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { FleetVehicleListComponent } from '../fleet-vehicle-list/fleet-vehicle-list.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';

describe('CollapsibleSideNavComponent', () => {
  let component: CollapsibleSideNavComponent;
  let fixture: ComponentFixture<CollapsibleSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        RouterTestingModule,
        PerfectScrollbarModule,
        MatIconModule,
        MatTooltipModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        CollapsibleSideNavComponent,
        DropdownComponent,
        LoaderComponent,
        FleetVehicleListComponent,
        SearchHighlightPipe
      ],
      providers: [
        ToolbarToggleFilterbarService,
        ApiService,
        FleetService,
        SelectedVehicleService,
        FleetDataService,
        FleetFilterDataStoreService,
        ToolbarToggleFilterbarService,
        UtilService,
        UserService,
        NavmapService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsibleSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
