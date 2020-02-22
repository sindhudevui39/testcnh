import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetHistoryComponent } from './fleet-history.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { FleetHistoryService } from './services/fleet-history.service';
import { FleetPostNotificationService } from '../fleet-manage/services/fleet-post-notification.service';
import { user } from 'src/app/test-constants/User';
import { dummyHistories } from 'src/app/test-constants/fleet-notification-mock/fleet-mock-history-data';
import { of } from 'rxjs';

describe('FleetHistoryComponent', () => {
  let userService: UserService;
  let historyService: FleetHistoryService;
  let postService: FleetPostNotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateTestingModule.withTranslations({}),
        PerfectScrollbarModule
      ],
      declarations: [FleetHistoryComponent, LoaderComponent],
      providers: [FleetHistoryService, FleetPostNotificationService, UserService]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    historyService = TestBed.get(FleetHistoryService);
    historyService._userService.user = user;

    postService = TestBed.get(FleetPostNotificationService);
    postService.userEmail = userService.user['email'];
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetHistoryComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should have histories from HistoryService'`, async(() => {
    const fixture = TestBed.createComponent(FleetHistoryComponent);
    const component = fixture.debugElement.componentInstance;
    spyOn(historyService, 'getHistoryData').and.returnValue(of(dummyHistories));
    fixture.detectChanges();
    expect(component.histories).toEqual(dummyHistories);
  }));

  // it(`should have called isResponseEmpty()'`, async(() => {
  //  const fixture = TestBed.createComponent(FleetHistoryComponent);
  //  const component = fixture.debugElement.componentInstance;
  //   expect(component.isResponseEmpty(data)).toEqual(2);
  // }));
});
