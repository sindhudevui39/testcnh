import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CnhInboxListComponent } from './cnh-inbox-list.component';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { CnhInboxSorterComponent } from '../../components/cnh-inbox-sorter/cnh-inbox-sorter.component';
import { CnhCollapsibleComponent } from '../../components/cnh-collapsible/cnh-collapsible.component';
import {
  CnhSortableItemComponent,
  ISortObj
} from '../../components/cnh-sortable-item/cnh-sortable-item.component';
import { MatTableDataSource } from '@angular/material';
import { GlobalSortingService } from '../../services/global-sorting-service';
import { DataFileService } from '../../services/data-file.service';
import { DataFileStore } from '../../services/data-file.store';
import { DataFile } from '../../models/data-file.model';
import { UserService } from '@services/user/user.service';
import { UtilService } from '@services/util/util.service';
import { User } from '@models/user';
import {
  MatMenuModule,
  MatDialogModule,
  MatSnackBarModule,
  MatIconModule,
  MatTableModule,
  MatCheckboxModule
} from '@angular/material';
import { CnhHighlightPipe } from '../../pipe/cnh-highlights-pipe';
import {
  TranslateCompiler,
  TranslateFakeCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { By } from 'selenium-webdriver';
import { Injector } from '@angular/core';

const translations: any = {
  GLOBAL: {
    NAME: 'Name',
    SOURCE: 'Source',
    FILE_SIZE: 'File size',
    DATE: 'Date'
  }
};

export class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of(translations);
  }
}

class MockDataFileService {
  filteredDataFiles$: Observable<DataFile[]>;
}

class MockDataFileStore {
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public fetch() {
    return [];
  }
}

class MockUtilService {
  getTimezoneOffset() {
    return '+0530';
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
    preferredDateTime: 'GMT+01:30',
    companyName: ''
  };
  public getUserPreferredLang() {
    return 'en';
  }
  get user() {
    return of({});
  }
  public getTimeFormat() {
    return '+0530';
  }
}

class MockGlobalSortingService {
  public sortDefault$: BehaviorSubject<ISortObj> = new BehaviorSubject<ISortObj>(null);
  public isActive$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
}

describe('CnhInboxListComponent', () => {
  let component: CnhInboxListComponent;
  let fixture: ComponentFixture<CnhInboxListComponent>;
  let translate: TranslateService;
  let injector: Injector;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        MatIconModule,
        MatTableModule,
        MatCheckboxModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
          compiler: { provide: TranslateCompiler, useClass: TranslateFakeCompiler }
        })
      ],
      declarations: [
        CnhInboxListComponent,
        CnhInboxSorterComponent,
        CnhCollapsibleComponent,
        CnhSortableItemComponent,
        LoaderComponent,
        CnhHighlightPipe
      ],
      providers: [
        { provide: DataFileService, useClass: MockDataFileService },
        { provide: GlobalSortingService, useClass: MockGlobalSortingService },
        { provide: DataFileStore, useClass: MockDataFileStore },
        { provide: UserService, useClass: MockUserService },
        { provide: UtilService, useClass: MockUtilService },
        { provide: MatTableDataSource, useValue: {} },
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnhInboxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    translate.use('en');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
