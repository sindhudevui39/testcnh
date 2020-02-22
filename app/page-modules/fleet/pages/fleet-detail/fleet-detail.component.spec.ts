import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetDetailComponent } from './fleet-detail.component';
import { CollapsibleSideNavComponent } from '@fleet/components/collapsible-side-nav/collapsible-side-nav.component';
import { FleetVehicleInfoComponent } from './components/fleet-vehicle-info/fleet-vehicle-info.component';
import { FleetDutyReportComponent } from './components/fleet-duty-report/fleet-duty-report.component';
import { FleetFuelReportComponent } from './components/fleet-fuel-report/fleet-fuel-report.component';
import { LoadingRingComponent } from '@shared-components/loading-ring/loading-ring.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import {
  MatIconModule,
  MatCardModule,
  MatSelectModule,
  MatOptionModule,
  MatTooltipModule,
  TooltipComponent
} from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { FleetVehicleListComponent } from '@fleet/components/fleet-vehicle-list/fleet-vehicle-list.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { WordWrapTooltipDirective } from '@shared-directives/word-wrap-tooltip/word-wrap-tooltip.directive';

describe('FleetDetailComponent', () => {
  let component: FleetDetailComponent;
  let fixture: ComponentFixture<FleetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule.withTranslations({}),
        HttpClientTestingModule,
        PerfectScrollbarModule,
        MatIconModule,
        MatCardModule,
        MatSelectModule,
        MatOptionModule
      ],
      declarations: [
        FleetDetailComponent,
        CollapsibleSideNavComponent,
        FleetVehicleInfoComponent,
        FleetDutyReportComponent,
        FleetFuelReportComponent,
        LoadingRingComponent,
        DropdownComponent,
        FleetVehicleListComponent,
        LoaderComponent
      ],
      providers: [SearchHighlightPipe, WordWrapTooltipDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
