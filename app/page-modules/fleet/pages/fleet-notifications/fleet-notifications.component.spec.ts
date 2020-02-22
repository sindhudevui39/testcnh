import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetNotificationsComponent } from './fleet-notifications.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from '@services/user/user.service';
import { FleetPostNotificationService } from './fleet-manage/services/fleet-post-notification.service';
import { user } from 'src/app/test-constants/User';

describe('FleetNotificationsComponent', () => {
  let userService: UserService;
  let postService: FleetPostNotificationService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule, FormsModule],
      declarations: [FleetNotificationsComponent],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/'
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
    const fixture = TestBed.createComponent(FleetNotificationsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
