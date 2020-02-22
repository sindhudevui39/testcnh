import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetEditVehicleSelectionComponent } from './fleet-edit-vehicle-selection.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SearchComponent } from '@shared-components/search/search.component';
import { MatCheckboxModule } from '@angular/material';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FleetPostNotificationService } from '../../services/fleet-post-notification.service';
import { UserService } from '@services/user/user.service';
import { FleetVehicleUserService } from '../../services/fleet-vehicle-user.service';
import { FleetEditVehicleSelectionService } from '../../services/fleet-edit-vehicle-selection.service';
import { user } from 'src/app/test-constants/User';

describe('FleetEditVehicleSelectionComponent', () => {
  let userService: UserService;
  let fleetVehicleUserService: FleetVehicleUserService;
  let postService: FleetPostNotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [
        FleetEditVehicleSelectionComponent,
        SearchComponent,
        SearchHighlightPipe,
        DropdownComponent,
        LoaderComponent
      ],
      providers: [
        FleetPostNotificationService,
        UserService,
        FleetVehicleUserService,
        FleetEditVehicleSelectionService
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
    const fixture = TestBed.createComponent(FleetEditVehicleSelectionComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
