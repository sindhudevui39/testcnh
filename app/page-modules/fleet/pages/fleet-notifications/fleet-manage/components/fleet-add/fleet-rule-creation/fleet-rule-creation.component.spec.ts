import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetRuleCreationComponent } from './fleet-rule-creation.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from '../../../services/fleet-manage.service';
import { FleetPostNotificationService } from '../../../services/fleet-post-notification.service';
import { FleetVehicleUserService } from '../../../services/fleet-vehicle-user.service';
import { user } from 'src/app/test-constants/User';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetRuleCreationComponent', () => {
  let userService: UserService;
  let manageService: FleetManageService;
  let postService: FleetPostNotificationService;
  let fleetVehicleUserService: FleetVehicleUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        PerfectScrollbarModule,
        MatFormFieldModule,
        MatDialogModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [FleetRuleCreationComponent, DropdownComponent],
      providers: [
        FleetManageService,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        FleetPostNotificationService,
        FleetVehicleUserService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    manageService = TestBed.get(FleetManageService);
    manageService.userEmail = user.email;
    postService = TestBed.get(FleetPostNotificationService);
    fleetVehicleUserService = TestBed.get(FleetVehicleUserService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetRuleCreationComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
