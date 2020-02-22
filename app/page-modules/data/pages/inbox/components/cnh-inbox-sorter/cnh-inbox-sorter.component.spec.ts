import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CnhInboxSorterComponent } from './cnh-inbox-sorter.component';
import {
  CnhSortableItemComponent,
  ISortObj
} from '../cnh-sortable-item/cnh-sortable-item.component';
import { GlobalSortingService } from '../../services/global-sorting-service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { By } from 'selenium-webdriver';

describe('CnhInboxSorterComponent', () => {
  let component: CnhInboxSorterComponent;
  let fixture: ComponentFixture<CnhInboxSorterComponent>;

  class MockGlobalSortingService {
    public sortDefault$: BehaviorSubject<ISortObj> = new BehaviorSubject<ISortObj>(null);
    public isActive$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot()],
      declarations: [CnhInboxSorterComponent, CnhSortableItemComponent],
      providers: [
        { provide: GlobalSortingService, useClass: MockGlobalSortingService },
        TranslateService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CnhInboxSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
