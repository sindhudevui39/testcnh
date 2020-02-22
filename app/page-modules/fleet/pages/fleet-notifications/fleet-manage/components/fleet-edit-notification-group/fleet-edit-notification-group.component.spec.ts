import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetEditNotificationGroupComponent } from './fleet-edit-notification-group.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatCheckboxModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FleetEditVehicleSelectionComponent } from '../fleet-edit-vehicle-selection/fleet-edit-vehicle-selection.component';
import { SearchComponent } from '@shared-components/search/search.component';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FleetPostNotificationService } from '../../services/fleet-post-notification.service';
import { user } from 'src/app/test-constants/User';
import { FleetEditVehicleSelectionService } from '../../services/fleet-edit-vehicle-selection.service';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from '../../services/fleet-manage.service';
import { FleetVehicleSelectService } from '@fleet/services/fleet-vehicle-select/fleet-vehicle-select.service';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetEditNotificationGroupComponent', () => {
  let postService: FleetPostNotificationService;
  let userService: UserService;
  let fleetVehicleSelectService: FleetVehicleSelectService;
  let fleetEditVehicleSelectionService: FleetEditVehicleSelectionService;
  let fleetManageService: FleetManageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetEditNotificationGroupComponent,
        FleetEditVehicleSelectionComponent,
        SearchHighlightPipe,
        SearchComponent,
        DropdownComponent,
        LoaderComponent
      ],
      providers: [
        FleetPostNotificationService,
        FleetEditVehicleSelectionService,
        UserService,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: ''
        },
        FleetManageService,
        FleetVehicleSelectService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    fleetVehicleSelectService = TestBed.get(FleetVehicleSelectService);

    postService = TestBed.get(FleetPostNotificationService);
    postService.userEmail = userService.user['email'];

    fleetEditVehicleSelectionService = TestBed.get(FleetEditVehicleSelectionService);
    fleetManageService = TestBed.get(FleetManageService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetEditNotificationGroupComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
});
