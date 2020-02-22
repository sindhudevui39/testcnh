import { async, TestBed } from '@angular/core/testing';

import { AppNotificationHistroyComponent } from './app-notification-histroy.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { user } from 'src/app/test-constants/User';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppNotificationHistroyComponent', () => {
  let userService: UserService;
  let postService: FleetPostNotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [AppNotificationHistroyComponent],
      providers: [
        {
          provide: 'window',
          useValue: window
        }
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
    const fixture = TestBed.createComponent(AppNotificationHistroyComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
