import {
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output,
  TrackByFunction,
  ViewChild,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import { Set as ImmSet } from 'immutable';
import { Observable, Subscription, Subject } from 'rxjs';
import { MatTableDataSource, MatSort, MatSortable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'underscore';
import {
  CnhTrowserService,
  TROWSER_DATA
} from '../../services/data-access-setup-service';
import { TranslateService } from '@ngx-translate/core';
enum SortingLabels {
  asc = 'GLOBAL.ASCENDENT',
  desc = 'GLOBAL.DESCENDENT'
}

@Component({
  selector: 'cnh-fields-selection-widget',
  templateUrl: './cnh-fields-selection-widget.component.html',
  styleUrls: ['./cnh-fields-selection-widget.component.css']
})
export class CnhFieldsSelectionWidgetComponent implements OnInit, OnDestroy {
  protected subscriptions: Set<Subscription> = new Set();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  dataSource = new MatTableDataSource([]);
  @Output()
  public selectedFields: EventEmitter<any[]>;
  public fields: any[];
  public unFilteredFields: any[];
  public isLoading: boolean;
  public growerAllOptions: string;
  public farmAllOptions: string;
  public searchColumns: any[];
  public gridColumns: any[];
  public growerOptions: any[];
  public farmOptions: any[];
  public searchValue: string;
  public checkedFields: ImmSet<any>;
  numSelected: number;
  public selectedGrower: any[];
  public selectedFarm: any[];
  public checkedAll: boolean;
  public indeterminateAll: boolean;
  public sortingLabel: string;
  public searchString: string;
  searchIconColor: boolean;
  formatforArea: string;
  displayedColumns: string[] = ['select', 'Name', 'FIELD_SIZE'];
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort)
  sort: MatSort;

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
  public constructor(
    private _cnhTrowserService: CnhTrowserService,
    @Inject(TROWSER_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    public readonly translate: TranslateService
  ) {
    this.fields = [];
    this.unFilteredFields = [];
    this.isLoading = false;
    this.growerOptions = [];
    this.farmOptions = [];
    this.formatforArea = '';
    this.searchValue = '';
    this.checkedFields = ImmSet<any>();

    this.selectedGrower = [];
    this.selectedFarm = [];
    this.checkedAll = false;
    this.indeterminateAll = false;

    this.sortingLabel = SortingLabels.asc;
    this.searchString = '';

    this.selectedFields = new EventEmitter<any[]>();
  }

  public ngOnInit(): void {
    this.growerAllOptions = this.translate.instant('GLOBAL.ALL');
    this.farmAllOptions = this.translate.instant('GLOBAL.ALL');
    this.sort.sort(<MatSortable>{
      id: 'Name',
      start: 'asc'
    });
    this.searchIconColor = true;
    this.isLoading = true;
    this._cnhTrowserService.fieldRemove.subscribe(value => {
      if (value.length > 0) {
        this.selection.deselect(value[0]);
        this.emitselectedValue();
      }
    });

    this._cnhTrowserService.getDataFields().subscribe(fields => {
      this.isLoading = false;
      for (let i = 0; i < fields.Values.length; i++) {
        if (fields.Values[i].Area) {
          this.formatforArea = fields.Values[i].Area.Uom;
          break;
        }
      }
      this.dataSource = new MatTableDataSource(fields.Values);
      this.dataSource.filterPredicate = (data, filter) => {
        const filterValue = JSON.parse(filter);
        const growerValue =
          filterValue.GrowerID.length === 0
            ? true
            : _.findIndex(filterValue.GrowerID, { value: data.GrowerID }) > -1;
        const farmValue =
          filterValue.FarmID.length === 0
            ? true
            : _.findIndex(filterValue.FarmID, { value: data.FarmID }) > -1;
        return (
          data.Name.toLowerCase().includes(filterValue.searchString) &&
          growerValue &&
          farmValue
        );
      };
      this.dataSource.sortingDataAccessor = (item, property) => {
        return item.Name;
      };
      if (this.data.shareData && this.data.shareData.sharedItems.length > 0) {
        for (let i = 0; i < this.data.shareData.sharedItems.length; i++) {
          if (
            _.where(this.dataSource.data, {
              ID: this.data.shareData.sharedItems[i].id
            }).length > 0
          ) {
            this.selection.select(
              _.where(this.dataSource.data, {
                ID: this.data.shareData.sharedItems[i].id
              })[0]
            );
          }
        }
      }
      this.emitselectedValue();
      this.dataSource.sort = this.sort;
      this.fields = fields;
      this._onFieldsChanged();
    });
  }
  blurFocusChange(booleanValue: boolean) {
    this.searchIconColor = booleanValue;
  }
  changeMasterCheckbox() {
    this.masterToggle();
    this.cdr.detectChanges();
    this.emitselectedValue();
  }
  changeEachCheckbox(row) {
    this.selection.toggle(row);
    this.cdr.detectChanges();
    this.emitselectedValue();
  }
  focusInput() {
    const searchelement = document.querySelectorAll('[id="searchInput"]');
    if (searchelement.length > 1) {
      searchelement[1]['focus']();
    }
  }
  applyFilter(searchIndex: number) {
    if (document.getElementsByClassName('field-selection--body').length > 0) {
      document.getElementsByClassName('field-selection--body')[0].scrollTop = 0;
    }
    const filterSection = {};

    if (this.searchValue !== undefined) {
      filterSection['searchString'] = this.searchValue.trim().toLowerCase();
    } else {
      filterSection['searchString'] = this.searchValue;
    }
    filterSection['GrowerID'] = this.selectedGrower;
    filterSection['FarmID'] = this.selectedFarm;
    this.dataSource.filter = JSON.stringify(filterSection);
    if (searchIndex === 1) {
      this._onFieldsChanged();
    } else if (searchIndex === 2) {
      if (this.selectedGrower.length === 0) {
        this._changeGrowerOptions();
      }
      if (this.selectedFarm.length === 0) {
        this._changeFarmOptions();
      }
    } else if (searchIndex === 3) {
      if (this.selectedFarm.length === 0) {
        this._changeFarmOptions();
      }
      if (this.selectedGrower.length === 0) {
        this._changeGrowerOptions();
      }
    }
    this.changeSelectedValueInList();
  }

  emitselectedValue() {
    this.changeSelectedValueInList();
    this.selectedFields.emit(this.selection.selected);
  }
  changeSelectedValueInList() {
    this.numSelected = 0;
    for (let i = 0; i < this.dataSource.filteredData.length; i++) {
      if (
        _.findIndex(this.selection.selected, {
          ID: this.dataSource.filteredData[i].ID
        }) > -1
      ) {
        this.numSelected += 1;
      }
    }

    if (this.selectedGrower.length > 0 && this.farmOptions.length > 0) {
      this.farmAllOptions =
        this.translate.instant('GLOBAL.ALL') +
        ' (' +
        this.farmOptions.length +
        ')';
    } else {
      this.farmAllOptions = this.translate.instant('GLOBAL.ALL');
    }

    if (this.selectedFarm.length > 0 && this.growerOptions.length > 0) {
      this.growerAllOptions =
        this.translate.instant('GLOBAL.ALL') +
        ' (' +
        this.growerOptions.length +
        ')';
    } else {
      this.growerAllOptions = this.translate.instant('GLOBAL.ALL');
    }
  }
  isAllSelected() {
    return this.numSelected === this.dataSource.filteredData.length;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  private _onFieldsChanged(): void {
    this._changeGrowerOptions();
    this._changeFarmOptions();
  }

  private _changeGrowerOptions(): void {
    let growerIds = ImmSet<number | string>();

    this.growerOptions = [];
    for (const f of this.dataSource.filteredData) {
      if (f && f.GrowerID && !growerIds.has(f.GrowerID)) {
        growerIds = growerIds.add(f.GrowerID);

        this.growerOptions.push({
          label: f.GrowerName,
          value: f.GrowerID
        });
      }
    }
    this.growerOptions = _.sortBy(this.growerOptions, function(i) {
      if (_.isString(i['label'])) {
        return i['label'].toLowerCase();
      } else {
        return i['label'];
      }
    });
  }

  private _changeFarmOptions(): void {
    let farmIds = ImmSet<number | string>();
    this.farmOptions = [];
    for (const f of this.dataSource.filteredData) {
      if (f && f.FarmID && !farmIds.has(f.FarmID)) {
        farmIds = farmIds.add(f.FarmID);
        this.farmOptions.push({
          label: f.FarmName,
          value: f.FarmID
        });
      }
    }
    this.farmOptions = _.sortBy(this.farmOptions, function(i) {
      if (_.isString(i['label'])) {
        return i['label'].toLowerCase();
      } else {
        return i['label'];
      }
    });
  }
}
