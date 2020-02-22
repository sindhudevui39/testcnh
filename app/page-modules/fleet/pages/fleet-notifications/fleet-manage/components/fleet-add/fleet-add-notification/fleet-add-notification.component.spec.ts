import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetAddNotificationComponent } from './fleet-add-notification.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FleetVehicleSelectComponent } from '../fleet-vehicle-select/fleet-vehicle-select.component';
import { FleetRuleCreationComponent } from '../fleet-rule-creation/fleet-rule-creation.component';
import { FleetUserSelectComponent } from '../fleet-user-select/fleet-user-select.component';
import { FleetConfirmationSummaryComponent } from '../fleet-confirmation-summary/fleet-confirmation-summary.component';
import {
  MatStepperModule,
  MatFormFieldModule,
  MatIconModule,
  MatCheckboxModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatFormFieldControl
} from '@angular/material';
import { SearchComponent } from '@shared-components/search/search.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FleetPostNotificationService } from '../../../services/fleet-post-notification.service';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from '../../../services/fleet-manage.service';
import { FleetVehicleUserService } from '../../../services/fleet-vehicle-user.service';
import { user } from 'src/app/test-constants/User';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetAddNotificationComponent', () => {
  let userService: UserService;
  let manageService: FleetManageService;
  let postService: FleetPostNotificationService;
  let fleetVehicleUserService: FleetVehicleUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatStepperModule,
        MatFormFieldModule,
        MatDialogModule,
        MatCheckboxModule,
        MatIconModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetAddNotificationComponent,
        FleetVehicleSelectComponent,
        FleetRuleCreationComponent,
        FleetUserSelectComponent,
        FleetConfirmationSummaryComponent,
        SearchComponent,
        SearchHighlightPipe,
        DropdownComponent,
        LoaderComponent
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: ''
        },
        FleetPostNotificationService,
        UserService,
        FleetManageService,
        FleetVehicleUserService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    manageService = TestBed.get(FleetManageService);

    postService = TestBed.get(FleetPostNotificationService);
    postService.userEmail = userService.user['email'];

    fleetVehicleUserService = TestBed.get(FleetVehicleUserService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetAddNotificationComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
