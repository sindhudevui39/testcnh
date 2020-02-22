import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
// import { GlobalSortingService } from '../../../cnh-data/core/global-state/global-sorting-service';

/**
 * Possible overview/faults sorting order: ASC, DESC
 */
export enum SortOrder {
  ASC,
  DESC
}

/**
 * Sortable object interface
 */
export interface ISortObj {
  key?: string;
  order?: string;
}

@Component({
  selector: 'cnh-sortable-item',
  templateUrl: './cnh-sortable-item.component.html',
  styleUrls: ['./cnh-sortable-item.component.css']
})
export class CnhSortableItemComponent implements OnInit, OnChanges {
  @Input() public iconSet: any;
  @Input() public icon: any = null;
  @Input() public label: string;
  @Input() public key: string;
  @Input() public isSortable: boolean;
  @Input() public isActive: boolean;
  @Input() public align: string;
  @Output() private sorting: EventEmitter<any> = new EventEmitter<any>();

  private sorter: ISortObj = {};

  constructor() {
    this.isSortable = true;
    this.isActive = false;
    this.align = 'left';
  }
  // constructor(private globalSortingService: GlobalSortingService) {}

  public ngOnInit() {
    // const sortDefault = this.globalSortingService.sortDefault$.getValue();
    const sortDefault = { order: 'desc' };
    this.sorter.key = this.key;
    this.sorter.order = this.isActive
      ? SortOrder[sortDefault.order.toUpperCase()]
      : null;
    this.icon = this.iconSet ? this.iconSet[sortDefault.order] : this.icon;
  }

  public ngOnChanges(changes: any) {
    if (changes.isActive && changes.isActive.currentValue === false) {
      this.sorter.order = null;
    }
  }

  public onClick() {
    if (this.isSortable === false) {
      return;
    }
    const order = this.sorter.order === 'asc' ? 'desc' : 'asc';
    this.sorter = {
      key: this.key,
      order
    };
    this.sorting.emit(this.sorter);
    if (this.iconSet) {
      this.icon = order === 'asc' ? this.iconSet.asc : this.iconSet.desc;
    }
  }
}
