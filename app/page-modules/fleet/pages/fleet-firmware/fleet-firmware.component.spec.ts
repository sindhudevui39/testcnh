import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFirmwareComponent } from './fleet-firmware.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatDialogModule,
  MatIconModule,
  MatStepperModule,
  MatRadioModule,
  MatCheckboxModule,
  MatSelectModule,
  MatDialogRef
} from '@angular/material';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { FleetFirmwareSelectionComponent } from './components/fleet-firmware-selection/fleet-firmware-selection.component';
import { FleetFirmwareVehicleSelectionComponent } from './components/fleet-firmware-vehicle-selection/fleet-firmware-vehicle-selection.component';
import { FleetFirmwareVehicleModalComponent } from './components/fleet-firmware-vehicle-modal/fleet-firmware-vehicle-modal.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { SearchComponent } from '@shared-components/search/search.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FleetFirmwareConfirmationComponent } from './components/fleet-firmware-confirmation/fleet-firmware-confirmation.component';
import { WordWrapTooltipDirective } from '@shared-directives/word-wrap-tooltip/word-wrap-tooltip.directive';
import { FormsModule } from '@angular/forms';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';
import { UserService } from '@services/user/user.service';
import { FOTAApiService } from './services/fota-api.service';
import { FotaFilterService } from './services/fota-filter.service';
import { FotaService } from './services/fota/fota.service';
import { user } from 'src/app/test-constants/User';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FleetFirmwareComponent', () => {
  let component: FleetFirmwareComponent;
  let fixture: ComponentFixture<FleetFirmwareComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        MatIconModule,
        MatStepperModule,
        MatCheckboxModule,
        MatSelectModule,
        MatRadioModule,
        TranslateModule.forRoot(),
        MatDialogModule,
        PerfectScrollbarModule
      ],
      declarations: [
        FleetFirmwareComponent,
        FleetFirmwareSelectionComponent,
        FleetFirmwareVehicleSelectionComponent,
        FleetFirmwareConfirmationComponent,
        FleetFirmwareVehicleModalComponent,
        LoaderComponent,
        SearchComponent,
        SearchHighlightPipe,
        WordWrapTooltipDirective
      ],
      providers: [
        UserService,
        FOTAApiService,
        FotaFilterService,
        FotaService,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetFirmwareComponent);
    component = fixture.componentInstance;

    userService = TestBed.get(UserService);
    userService.user = user;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
