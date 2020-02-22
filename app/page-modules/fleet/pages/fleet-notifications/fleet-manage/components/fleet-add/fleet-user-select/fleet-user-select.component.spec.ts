import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetUserSelectComponent } from './fleet-user-select.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SearchComponent } from '@shared-components/search/search.component';
import { MatCheckboxModule } from '@angular/material';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FleetManageService } from '../../../services/fleet-manage.service';
import { FleetPostNotificationService } from '../../../services/fleet-post-notification.service';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';

describe('FleetUserSelectComponent', () => {
  let manageService: FleetManageService;
  let postService: FleetPostNotificationService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        FormsModule,
        HttpClientModule,
        PerfectScrollbarModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [FleetUserSelectComponent, LoaderComponent, SearchComponent, DropdownComponent],
      providers: [FleetManageService, FleetPostNotificationService, UserService]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;
    manageService = TestBed.get(FleetManageService);
    manageService.userEmail = userService['_user'].email;
    postService = TestBed.get(FleetPostNotificationService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetUserSelectComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
