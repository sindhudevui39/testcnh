import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetVehicleSelectComponent } from './fleet-vehicle-select.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SearchComponent } from '@shared-components/search/search.component';
import { MatCheckboxModule, MatDialogModule } from '@angular/material';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FleetManageService } from '../../../services/fleet-manage.service';
import { FleetPostNotificationService } from '../../../services/fleet-post-notification.service';
import { FleetVehicleUserService } from '../../../services/fleet-vehicle-user.service';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';

describe('FleetVehicleSelectComponent', () => {
  let userService: UserService;
  let manageService: FleetManageService;
  let postService: FleetPostNotificationService;
  let fleetVehicleUserService: FleetVehicleUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        PerfectScrollbarModule,
        FormsModule,
        MatDialogModule,
        HttpClientModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetVehicleSelectComponent,
        SearchComponent,
        SearchHighlightPipe,
        DropdownComponent,
        LoaderComponent
      ],
      providers: [
        UserService,
        FleetManageService,
        FleetPostNotificationService,
        FleetVehicleUserService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;
    manageService = TestBed.get(FleetManageService);
    manageService.userEmail = userService['_user'].email;
    postService = TestBed.get(FleetPostNotificationService);
    fleetVehicleUserService = TestBed.get(FleetVehicleUserService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetVehicleSelectComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
