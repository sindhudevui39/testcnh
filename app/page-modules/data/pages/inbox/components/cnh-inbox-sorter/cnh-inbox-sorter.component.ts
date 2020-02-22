import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISortObj } from '../cnh-sortable-item/cnh-sortable-item.component';
import { TranslateService } from '@ngx-translate/core';
import {
  DataFileSortBy,
  GlobalSortingService
} from '../../services/global-sorting-service';

import * as _ from 'underscore';
@Component({
  selector: 'cnh-inbox-sorter',
  templateUrl: './cnh-inbox-sorter.component.html',
  styleUrls: ['./cnh-inbox-sorter.component.css']
})
export class CnhInboxSorterComponent implements OnInit {
  @Output()
  public sorting: EventEmitter<any> = new EventEmitter();
  public columns: Array<any> = [
    {
      key: 'NAME',
      type: 'icon',
      size: 4,
      data: {
        label: this.translate.instant('GLOBAL.NAME'),
        iconSet: {
          asc: 'sort-asc',
          desc: 'sort-desc'
        }
      }
    },
    {
      key: 'SOURCE',
      type: 'label',
      size: 3,
      data: {
        label: this.translate.instant('GLOBAL.SOURCE'),
        iconSet: {
          asc: 'sort-asc',
          desc: 'sort-desc'
        }
      }
    },
    {
      key: 'SIZE',
      type: 'label',
      size: 2,
      data: {
        label: this.translate.instant('GLOBAL.FILE_SIZE'),
        iconSet: {
          asc: 'sort-asc',
          desc: 'sort-desc'
        }
      }
    },
    {
      key: 'DATE',
      type: 'icon',
      size: 2,
      data: {
        iconSet: {
          asc: 'sort-asc',
          desc: 'sort-desc'
        },
        label: this.translate.instant('GLOBAL.DATE')
      }
    },
    {
      type: 'label',
      size: 1,
      data: {
        label: '',
        icon: '',
        align: 'right',
        isSortable: false
      }
    }
  ];

  constructor(private globalSortingService: GlobalSortingService,
    private readonly translate: TranslateService) {}

  public ngOnInit() {
    //  const components = this.headerComponent$;
    const isActive$ = this.globalSortingService.isActive$;
    isActive$.subscribe((value: any) => {
      _.each(this.columns, function(item, key) {
        item.key === value
          ? (item.data.isActive = true)
          : (item.data.isActive = false);
      });
      //    components.subscribe((items) => {
      //     items.map((item) => {
      //        value === item.key ? item.data.isActive = true : item.data.isActive = false;
      //      });
      //  });
    });
  }
  public onSortableClicked(sortObj: ISortObj) {
    this.sorting.emit(sortObj);
  }
}