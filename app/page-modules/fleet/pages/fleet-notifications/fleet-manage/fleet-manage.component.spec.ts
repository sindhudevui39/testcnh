import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetManageComponent } from './fleet-manage.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { FleetManageNotificationComponent } from './components/fleet-manage-notification/fleet-manage-notification.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { MatMenuModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FleetPostNotificationService } from './services/fleet-post-notification.service';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from './services/fleet-manage.service';
import { user } from 'src/app/test-constants/User';

describe('FleetManageComponent', () => {
  let userService: UserService;
  let manageService: FleetManageService;
  let postService: FleetPostNotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatMenuModule,
        MatDialogModule,
        PerfectScrollbarModule,
        HttpClientModule,
        TranslateTestingModule.withTranslations({}),
        PerfectScrollbarModule
      ],
      declarations: [FleetManageComponent, FleetManageNotificationComponent, LoaderComponent],
      providers: [FleetPostNotificationService, UserService, FleetManageService]
    }).compileComponents();
  }));
  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    manageService = TestBed.get(FleetManageService);

    postService = TestBed.get(FleetPostNotificationService);
    postService.userEmail = userService.user['email'];
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetManageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
