import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFirmwareVehicleSelectionComponent } from './fleet-firmware-vehicle-selection.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatDialogModule,
  MatCheckboxModule,
  MatSelectModule,
  MatOptionModule
} from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { SearchComponent } from '@shared-components/search/search.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { UserService } from '@services/user/user.service';
import { FOTAApiService } from '../../services/fota-api.service';
import { FotaFilterService } from '../../services/fota-filter.service';
import { FotaService } from '../../services/fota/fota.service';
import { ApiService } from '@services/api/api.service';

describe('FleetFirmwareVehicleSelectionComponent', () => {
  let component: FleetFirmwareVehicleSelectionComponent;
  let fixture: ComponentFixture<FleetFirmwareVehicleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        TranslateModule.forRoot(),
        PerfectScrollbarModule,
        MatDialogModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule
      ],
      declarations: [
        FleetFirmwareVehicleSelectionComponent,
        SearchComponent,
        SearchHighlightPipe,
        LoaderComponent
      ],
      providers: [
        UserService,
        ApiService,
        FOTAApiService,
        FotaFilterService,
        FotaService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetFirmwareVehicleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
