import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { Connections } from './connections.component';
import { CnhSnackBarService } from '../data-access/services/cnh-snack-bar.service';
import { UserService } from '@services/user/user.service';

import { MatDialog } from '@angular/material';
import { DataClientsService } from './services/data.service';
import { CnhModalComponent } from './components/cnh-modal/cnh-modal.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '@models/user';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('Connections', () => {
  let component: Connections;
  let fixture: ComponentFixture<Connections>;

  class MockDataClientsService {
    getClients() {
      return of([{}]);
    }
    getClientsConnectInfo() {
      return of([{}]);
    }
    getUserData() {
      return of({});
    }
    getStatusOfUser() {
      return of({});
    }
    getregionList() {
      return of({});
    }
  }

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
      preferredDateTime: '',
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
      imports: [
        BrowserModule,
        FormsModule,
        SharedModule,
        HttpClientModule,
        CustomMaterialModule,
        RouterTestingModule.withRoutes([]),
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [Connections, CnhModalComponent],
      providers: [
        { provide: DataClientsService, useClass: MockDataClientsService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: CnhSnackBarService, useClass: MockCnhSnackBarService },
        { provide: UserService, useClass: MockUserService },
        { provide: 'window', useValue: window }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Connections);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should open connected modal', () => {
    component.openConnectModal({});
  });
  it('should open disconnected modal', () => {
    component.openDisconnectModal({});
  });
  // it('should load app', () => {
  //   const app = {client_metadata: {landing_page: 'test.com'}}
  //   component.reloadApp(applySourceSpanToExpressionIfNeeded);
  // });
});
