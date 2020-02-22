import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { InboxComponent } from './inbox.component';
import { CnhSearchComponent } from './components/cnh-search/cnh-search.component';
import { CnhInboxListComponent } from './layouts/cnh-inbox-list/cnh-inbox-list.component';
import { CnhInboxSorterComponent } from './components/cnh-inbox-sorter/cnh-inbox-sorter.component';
import { CnhCollapsibleComponent } from './components/cnh-collapsible/cnh-collapsible.component';
import { GroupByPipe } from './pipe/group-by.pipe';
import { CnhSortableItemComponent } from './components/cnh-sortable-item/cnh-sortable-item.component';
import { CnhHighlightPipe } from './pipe/cnh-highlights-pipe';
import { GlobalSortingService } from './services/global-sorting-service';
import { DataFilesFilterService } from './services/data-files-filters.service';
import { DataFileStore } from './services/data-file.store';
import { DataFileService } from './services/data-file.service';
import { UtilService } from '@services/util/util.service';
import { UserService } from '@services/user/user.service';
import { BehaviorSubject, Observable, pipe, of } from 'rxjs';
import { DataFile } from './models/data-file.model';
import { ISortObj } from './components/cnh-sortable-item/cnh-sortable-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import {
  TranslateCompiler,
  TranslateFakeCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { User } from '@models/user';

const translations: any = {
  GLOBAL: {
    NAME: 'Name',
    SOURCE: 'Source',
    FILE_SIZE: 'File size',
    DATE: 'Date',
    SEARCH_PLACEHOLDER: 'Search'
  }
};

export class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of(translations);
  }
}

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  class MockDataFilesFilterService {
    filteredDataFiles$: Observable<DataFile[]>;
    changeFilter(filter) {}
  }
  class MockDataFileStore {
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public fetch() {
      return [];
    }
  }
  class MockDataFileService {
    filteredDataFiles$: Observable<DataFile[]>;
  }
  class MockGlobalSortingService {
    public sortDefault$: BehaviorSubject<ISortObj> = new BehaviorSubject<ISortObj>(null);
    public isActive$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        SharedModule,
        HttpClientModule,
        CustomMaterialModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
          compiler: { provide: TranslateCompiler, useClass: TranslateFakeCompiler }
        })
      ],
      declarations: [
        InboxComponent,
        CnhSearchComponent,
        CnhInboxListComponent,
        CnhInboxSorterComponent,
        CnhCollapsibleComponent,
        GroupByPipe,
        CnhSortableItemComponent,
        CnhHighlightPipe
      ],
      providers: [
        {
          provide: DataFilesFilterService,
          useClass: MockDataFilesFilterService
        },
        { provide: DataFileStore, useClass: MockDataFileStore },
        { provide: GlobalSortingService, useClass: MockGlobalSortingService },
        { provide: DataFileService, useClass: MockDataFileService },
        { provide: UserService, useClass: MockUserService },
        { provide: UtilService, useClass: MockUtilService },
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // translate = injector.get(TranslateService);
    // translate.use('en');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSearchValueChange function should call changeFilter', () => {
    spyOn(component._dataFilesFilterService, 'changeFilter');
    component.onSearchValueChange('test');
    expect(component._dataFilesFilterService.changeFilter).toHaveBeenCalled();
  });
});
