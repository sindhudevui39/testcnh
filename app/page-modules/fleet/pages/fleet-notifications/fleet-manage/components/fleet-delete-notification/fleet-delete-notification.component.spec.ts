import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetDeleteNotificationComponent } from './fleet-delete-notification.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from '../../services/fleet-manage.service';
import { FleetEditDeleteService } from '../../services/fleet-edit-delete.service';
import { user } from 'src/app/test-constants/User';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetDeleteNotificationComponent', () => {
  let userService: UserService;
  let manageService: FleetManageService;
  let fleetEditDeleteService: FleetEditDeleteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientModule, TranslateTestingModule.withTranslations({})],
      declarations: [FleetDeleteNotificationComponent],
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
    const fixture = TestBed.createComponent(FleetDeleteNotificationComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
