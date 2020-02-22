import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetNotificationCloseModalComponent } from './fleet-notification-close-modal.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FleetPostNotificationService } from '../../../services/fleet-post-notification.service';
import { FleetVehicleUserService } from '../../../services/fleet-vehicle-user.service';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetNotificationCloseModalComponent', () => {
  let userService: UserService;
  let fleetVehicleUserService: FleetVehicleUserService;
  let postService: FleetPostNotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientModule, TranslateTestingModule.withTranslations({})],
      declarations: [FleetNotificationCloseModalComponent],
      providers: [
        FleetPostNotificationService,
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        FleetVehicleUserService,
        UserService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    fleetVehicleUserService = TestBed.get(FleetVehicleUserService);

    postService = TestBed.get(FleetPostNotificationService);
    postService.userEmail = userService.user['email'];
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetNotificationCloseModalComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
