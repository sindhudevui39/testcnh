import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { SharedModule } from '../../../../shared/shared.module';

import { APP_BASE_HREF } from '@angular/common';

import { CnhSearchComponent } from '../inbox/components/cnh-search/cnh-search.component';
import { DataRoutingModule } from '../../data-routing.module';
import { AppRoutingModule } from '../../../../app-routing.module';
import { InboxComponent } from '../inbox/inbox.component';
import { DataAccessComponent } from './data-access.component';
import { User } from '@models/user';
import { CnhPagePartnerDataAccessComponent } from '../data-access/components/cnh-page-partner-data-access/cnh-page-partner-data-access.component';
import { CnhPageMyDataAccessComponent } from '../data-access/components/cnh-page-my-data-access/cnh-page-my-data-access.component';
import { Connections } from '../Connections/connections.component';
import { CnhInboxListComponent } from '../inbox/layouts/cnh-inbox-list/cnh-inbox-list.component';
import { CnhShareFieldSummaryComponent } from '../data-access/components/cnh-share-field-summary/cnh-share-field-summary.component';
import { CnhInboxSorterComponent } from '../inbox/components/cnh-inbox-sorter/cnh-inbox-sorter.component';
import { CnhCollapsibleComponent } from '../inbox/components/cnh-collapsible/cnh-collapsible.component';
import { CnhHighlightPipe } from '../inbox/pipe/cnh-highlights-pipe';
import { CnhSortableItemComponent } from '../inbox/components/cnh-sortable-item/cnh-sortable-item.component';
import { CnhModalInviteComponent } from './components/cnh-modal-invite/cnh-modal-invite.component';
import { CnhTrowserDataSharingComponent } from './layouts/cnh-trowser-data-sharing/cnh-trowser-data-sharing.component';
import { CnhFieldsSelectionWidgetComponent } from './layouts/cnh-fields-selection-widget/cnh-fields-selection-widget.component';
import { CnhOperationsSelectionWidgetComponent } from './layouts/cnh-operations-selection-widget/cnh-operations-selection-widget.component';

import { DataAccessClientsService } from './services/data-access.services';
import { UserService } from '@services/user/user.service';
import { CnhSnackBarService } from './services/cnh-snack-bar.service';
import { CnhTrowserService } from './services/data-access-setup-service';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { GroupByPipe } from '../inbox/pipe/group-by.pipe';
import { of, BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CnhAdvancedSelectComponent } from './components/cnh-advanced-select/cnh-advanced-select.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
describe('DataAccessComponent', () => {
  let component: DataAccessComponent;
  let fixture: ComponentFixture<DataAccessComponent>;

  class MockDataAccessClientsService {
    Isloading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public list$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    public listfromAPI$: BehaviorSubject<any[]> = new BehaviorSubject([]);

    public routeId$: BehaviorSubject<string> = new BehaviorSubject(null);
    getDataAccess() {
      return of([{}]);
    }
    getUserData() {
      return of({});
    }
  }

  class MockCnhTrowserService {}

  class MockUserService {
    _user: User = {
      id: '65656567778sfdfs',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'testmail@testmail.com',
      roles: 'testrole',
      brand: 'brand',
      isDealer: false,
      isEulaAccepted: false,
      preferredLanguage: 'en',
      companyId: '5934kngkgflg',
      phone: '2345246896',
      preferredTimeZone: 'UTC',
      countryCode: '',
      preferredDateTime: 'GMT+01:30',
      companyName: ''
    };
    public getUserPreferredLang() {
      return 'en';
    }
    get user() {
      return of({});
    }
  }

  class MockMatDialog {
    open(comp: any, data: any) {
      return {
        afterClosed: function() {
          return of({});
        }
      };
    }
  }

  class MockCnhSnackBarService {
    open(message: string) {
      return of({});
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataAccessComponent,
        CnhSearchComponent,
        InboxComponent,
        CnhPagePartnerDataAccessComponent,
        CnhPageMyDataAccessComponent,
        Connections,
        CnhInboxListComponent,
        CnhShareFieldSummaryComponent,
        CnhInboxSorterComponent,
        CnhCollapsibleComponent,
        CnhHighlightPipe,
        GroupByPipe,
        CnhSortableItemComponent,
        CnhModalInviteComponent,
        CnhTrowserDataSharingComponent,
        CnhFieldsSelectionWidgetComponent,
        CnhOperationsSelectionWidgetComponent,
        CnhAdvancedSelectComponent,
        CnhAdvancedSelectComponent
      ],
      imports: [
        DataRoutingModule,
        AppRoutingModule,
        CustomMaterialModule,
        HttpClientModule,
        BrowserModule,
        FormsModule,
        SharedModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FormsModule,
        TranslateTestingModule.withTranslations({})
      ],
      providers: [
        {
          provide: DataAccessClientsService,
          useClass: MockDataAccessClientsService
        },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: CnhSnackBarService, useClass: MockCnhSnackBarService },
        { provide: UserService, useClass: MockUserService },
        { provide: CnhTrowserService, useClass: MockCnhTrowserService },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
