import { async, TestBed } from '@angular/core/testing';

import { FleetNotificationToolbarComponent } from './fleet-notification-toolbar.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { Location, LocationStrategy, APP_BASE_HREF, PathLocationStrategy } from '@angular/common';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from '../../fleet-manage/services/fleet-manage.service';
import { user } from 'src/app/test-constants/User';
import { FleetHistoryService } from '../../fleet-history/services/fleet-history.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('FleetNotificationToolbarComponent', () => {
  let userService: UserService;
  let manageService: FleetManageService;
  let historyService: FleetHistoryService;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [FleetNotificationToolbarComponent],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        UserService,
        FleetManageService,
        FleetHistoryService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    manageService = TestBed.get(FleetManageService);
    manageService.userEmail = userService.user['email'];
    historyService = TestBed.get(FleetHistoryService);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetNotificationToolbarComponent);
    const component = fixture.componentInstance;
    // const navigateSpy = spyOn(location, 'path');
    // expect(navigateSpy).toHaveBeenCalledWith(['/manage']);
    expect(component).toBeTruthy();
  });
});
