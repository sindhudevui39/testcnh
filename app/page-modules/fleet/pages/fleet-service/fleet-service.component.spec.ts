import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetServiceComponent } from './fleet-service.component';
import { CollapsibleSideNavComponent } from '@fleet/components/collapsible-side-nav/collapsible-side-nav.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatIconModule } from '@angular/material';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { FleetVehicleListComponent } from '@fleet/components/fleet-vehicle-list/fleet-vehicle-list.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';

describe('FleetServiceComponent', () => {
  let component: FleetServiceComponent;
  let fixture: ComponentFixture<FleetServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatIconModule,
        PerfectScrollbarModule,
        RouterTestingModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetServiceComponent,
        CollapsibleSideNavComponent,
        FleetVehicleListComponent,
        SearchHighlightPipe,
        LoaderComponent,
        DropdownComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
