import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetManageNotificationComponent } from './fleet-manage-notification.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatMenuModule, MatDialog } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { FleetPostNotificationService } from '../../services/fleet-post-notification.service';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';

describe('FleetManageNotificationComponent', () => {
  let userService: UserService;
  let postService: FleetPostNotificationService;

  class MockMatDialog {
    open(comp: any, data: any) {
      return {
        afterClosed: function() {
          return of({});
        }
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule, HttpClientModule, TranslateTestingModule.withTranslations({})],
      declarations: [FleetManageNotificationComponent],
      providers: [
        { provide: MatDialog, useClass: MockMatDialog },
        FleetPostNotificationService,
        UserService
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    postService = TestBed.get(FleetPostNotificationService);
    postService.userEmail = userService.user['email'];
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetManageNotificationComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
