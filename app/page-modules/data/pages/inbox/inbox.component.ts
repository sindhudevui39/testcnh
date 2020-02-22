import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import * as _ from 'underscore';
import { map } from 'rxjs/operators';
import { DataFileStore } from './services/data-file.store';
import { DataFile } from './models/data-file.model';
import { DataFileSortBy, GlobalSortingService } from './services/global-sorting-service';
import simplebar from 'simplebar';
import { Router } from '@angular/router';
import { DataFilesFilterService, IFilter } from './services/data-files-filters.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit, AfterViewInit {
  public fileList$: Observable<DataFile[]>;
  public currentSearch$: Observable<string>;
  public searchValue: string;
  itemlength: number = 0;
  selected = 'user';
  searchIconColor: boolean;
  scrollPos = 0;
  Scrollel: any;
  fileList: any = [];
  allValues = [];
  ArrayOfCollapsedList = [];
  filterList = [];
  constructor(
    public _dataFilesFilterService: DataFilesFilterService,
    private dataFileStore: DataFileStore,
    private globalSortingService: GlobalSortingService,
    private router: Router,
    public readonly translate: TranslateService,
    public userService: UserService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.translate.setDefaultLang('en');
    this.fileList$ = combineLatest(
      this._dataFilesFilterService.filteredDataFiles$,
      this.globalSortingService.sortDefault$
    ).pipe(
      map(([files, sortObj]) => {
        let sortKey = sortObj.key.toLowerCase();
        if (sortKey === 'date') {
          sortKey = 'creationDate';
        }
        if (sortKey === 'name') {
          sortKey = 'fileName';
        }
        if (sortKey === 'size') {
          sortKey = 'size';
        }
        if (sortKey === 'source') {
          sortKey = 'UserEmail';
        }

        if (sortObj) {
          if (sortObj.order === 'asc') {
            return _.sortBy(files, function(i) {
              if (_.isString(i[sortKey])) {
                return i[sortKey].toLowerCase();
              } else {
                return i[sortKey];
              }
            });
          } else {
            return _.sortBy(files, function(i) {
              if (_.isString(i[sortKey])) {
                return i[sortKey].toLowerCase();
              } else {
                return i[sortKey];
              }
            }).reverse();
          }
        }
        return files;
      })
    );

    this.matIconRegistry.addSvgIcon(
      'inbox-user',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/ic-operator.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'inbox-vehicle',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/vechicle.svg')
    );
  }
  ngAfterViewInit() {
    let triggerFields;
    this.Scrollel = new simplebar(document.getElementById('infinite-scroller'));
    this.Scrollel.getScrollElement().addEventListener('scroll', event => {
      // const pos = event.target.scrollTop;
      // this.scrollPos = Math.floor(pos / 48);
      // this.processForLazyLoad(this.filterList);
      if (
        (event.target.scrollTop + event.target.clientHeight) / event.target.scrollHeight >
          80 / 100 &&
        !triggerFields
      ) {
        this.processForLazyLoad(this.filterList);
        triggerFields = true;
        setTimeout(() => {
          triggerFields = false;
        }, 500);
      }
    });
  }
  public transformSlice(value, start: number = 0, end: number = 20) {
    return value.slice(start, end);
  }
  processForLazyLoad(filteredValues) {
    // let allValues = [];
    const sortDate = this.globalSortingService.sortDefault$.value.key === 'DATE';
    const arrayOfCollapsedList = this.ArrayOfCollapsedList;
    // filteredValues.forEach(function(key) {
    //   if (!arrayOfCollapsedList.includes(key.key)) {
    //     allValues = allValues.concat(key.value);
    //   }
    // });
    // this.allValues = allValues;

    let addingFields = 0;
    filteredValues.forEach((element, index) => {
      // console.log(element);
      if (addingFields < 20) {
        if (!this.fileList[index]) {
          this.fileList[index] = {};
          this.fileList[index].key = sortDate ? element.key : null;
          this.fileList[index].value = [];
          element.value.forEach(val => {
            if (addingFields < 20) {
              this.fileList[index].value.push(val);
              addingFields++;
            }
          });
        } else {
          const ignorealreadyFiles = this.fileList[index].value.length - 1;
          element.value.forEach((val, i) => {
            if (i > ignorealreadyFiles && addingFields < 20) {
              this.fileList[index].value.push(val);
              addingFields++;
            }
          });
        }
      }
    });
    this.itemlength = Math.random();
    let allValues = [];
    let LazyallValue = [];
    filteredValues.forEach(function(key) {
      if (!arrayOfCollapsedList.includes(key.key) && sortDate) {
        allValues = allValues.concat(key.value);
      } else if (!sortDate) {
        allValues = allValues.concat(key.value);
      }
    });
    this.fileList.forEach(function(key) {
      if (!arrayOfCollapsedList.includes(key.key)) {
        LazyallValue = LazyallValue.concat(key.value);
      }
    });
    if (LazyallValue.length < 20 && LazyallValue.length < allValues.length) {
      this.processForLazyLoad(this.filterList);
    } else if (LazyallValue.length === allValues.length) {
      if (filteredValues.length !== this.fileList.length) {
        this.fileList = JSON.parse(JSON.stringify(filteredValues));
      }
    }
  }
  public ngOnInit() {
    let dataArr = this.dataFileStore.fetch(0);
    this.searchIconColor = true;
    this.translate.use(this.userService.getUserPreferredLang());
    this.onSearchValueChange('');
    this.globalSortingService.sortDefault$.next({ key: 'DATE', order: 'des' });
    this.globalSortingService.isActive$.next('DATE');
    this.fileList = [];
    this.currentSearch$ = this._dataFilesFilterService.activeSearch$;
    this.fileList$.subscribe(data => {
      this.fileList = [];
      if (this.Scrollel) {
        this.Scrollel.getScrollElement().scrollTop = 0;
      }

      this.itemlength = Math.random();
      this.filterList =
        this.globalSortingService.sortDefault$.value.key === 'DATE'
          ? this.transform(data, 'namedDate')
          : [{ key: 'Some Value', value: data }];
      this.processForLazyLoad(this.filterList);
    });
  }
  public transform(value: any[], filter: string): any {
    if (!filter) {
      return value;
    }
    let res: any = (value || []).reduce((prev, cur) => {
      return this.addAsArray(prev, cur[filter], cur);
    }, []);
    res = Object.keys(res).map(key => ({ key, value: res[key] }));
    return res;
  }

  private addAsArray(obj: any, property: string, value: any): any {
    Array.isArray(obj[property]) ? obj[property].push(value) : (obj[property] = [value]);
    return obj;
  }

  focusInput() {
    document.getElementById('searchInput').focus();
  }
  blurFocusChange(booleanValue: boolean) {
    this.searchIconColor = booleanValue;
  }

  public onSearchValueChange(value: string) {
    const searchFilter: IFilter = {
      type: 'searchString',
      target: ['fileName', 'UserEmail', 'UserFullName'],
      value
    };
    this._dataFilesFilterService.changeFilter(searchFilter);
  }
  collapsedList($event) {
    this.ArrayOfCollapsedList = $event;
    this.processForLazyLoad(this.filterList);
  }
  toggleChange($event) {
    if ($event.value === 'user') {
      this.selected = 'user';
      this.dataFileStore.fetch(0);
      // this.router.navigate(['/data/inbox']);
    } else if ($event.value === 'vehicle') {
      this.selected = 'vehicle';
      this.dataFileStore.fetch(1);
      // this.router.navigate(['/data/inbox']);
    }
  }
}
