import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetEditPreferenceComponent } from './fleet-edit-preference.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import {
  MatCheckboxModule,
  MatDialogModule,
  MatDialogRef,
  MatSnackBarModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FleetEditDeleteService } from '../../services/fleet-edit-delete.service';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from '../../services/fleet-manage.service';
import { user } from 'src/app/test-constants/User';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetEditPreferenceComponent', () => {
  let userService: UserService;
  let manageService: FleetManageService;
  let fleetEditDeleteService: FleetEditDeleteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        HttpClientModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [FleetEditPreferenceComponent],
      providers: [
        FleetEditDeleteService,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: ''
        },
        UserService,
        FleetManageService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;
    manageService = TestBed.get(FleetManageService);
    manageService.userEmail = userService['_user'].email;
    fleetEditDeleteService = TestBed.get(FleetEditDeleteService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetEditPreferenceComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
});
