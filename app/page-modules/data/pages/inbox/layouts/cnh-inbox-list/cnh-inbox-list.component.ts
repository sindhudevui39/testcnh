import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { DataFile } from '../../models/data-file.model';
import { DataFileService } from '../../services/data-file.service';
import { ISortObj } from '../../components/cnh-sortable-item/cnh-sortable-item.component';
import { GlobalSortingService } from '../../services/global-sorting-service';
import { DataFileStore } from '../../services/data-file.store';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import * as _ from 'underscore';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as fileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { UtilService } from '@services/util/util.service';
import { UserService } from '@services/user/user.service';
import { InboxSetupdataDialogComponent } from '../../components/inbox-setupdata-dialog/inbox-setupdata-dialog.component';
@Component({
  selector: 'cnh-inbox-list',
  templateUrl: './cnh-inbox-list.component.html',
  styleUrls: ['./cnh-inbox-list.component.css']
})
export class CnhInboxListComponent implements OnInit, OnChanges {
  //  @Input() public dataSet: DataFile[];
  @Output() public collapsedList: EventEmitter<Array<String>> = new EventEmitter();
  CollapsedListValue = [];
  displayedColumns: string[] = ['fileName', 'source', 'bytesToSize', 'creationDate', 'extension'];
  dataSource: any = {};
  @Input() public dataSet: any[];
  @Input() public searchString: string;
  @Input() public selectedtype: string;
  @Input() public scrollPos: number;
  @Input() public itemlength: number;
  tzOffset: string;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
  public isLoading: boolean;
  userTimeFormat: string;
  constructor(
    private dataFileFileService: DataFileService,
    private globalSortingService: GlobalSortingService,
    private dataFileStore: DataFileStore,
    private _utilService: UtilService,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.isLoading = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = {};
  }

  public onSortableClicked(sortObj: ISortObj) {
    this.globalSortingService.sortBy(sortObj);
  }
  ngOnInit() {
    this.tzOffset = this._utilService.getTimezoneOffset();
    let userTimeFormat = this.userService.getTimeFormat();
    userTimeFormat = userTimeFormat.replace('YYYY', 'yyyy');
    userTimeFormat = userTimeFormat.replace('DD', 'dd');
    this.userTimeFormat = userTimeFormat;
    this.dataFileStore.loading$.subscribe(value => {
      this.isLoading = value;
    });
  }
  onTabClicked(value: any) {
    if (!this.dataSource[value.key]) {
      this.dataSource[value.key] = new MatTableDataSource<any>(value.value);
    }
  }
  public trackByFn(index: number, dataFile: DataFile) {
    return dataFile.rawId;
  }
  public downloadFile(data) {
    this.dataFileFileService.downloadFiledata(data.FileUrl, data.fileName).subscribe(blob => {
      const blobContent = new Blob([blob], { type: 'application/zip' });
      fileSaver.saveAs(blobContent, data.fileName);
    });
  }
  sendtoVechicle(data) {
    const dialogRef = this.dialog.open(InboxSetupdataDialogComponent, {
      width: '725px',
      maxWidth: '80vw',
      data: [data]
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  checkCollapsible(isOpen: boolean, fileByNamedDate) {
    if (!isOpen && !this.CollapsedListValue.includes(fileByNamedDate)) {
      this.CollapsedListValue.push(fileByNamedDate);
    } else if (isOpen && this.CollapsedListValue.includes(fileByNamedDate)) {
      this.CollapsedListValue = this.CollapsedListValue.filter(function(v) {
        return v !== fileByNamedDate;
      });
    }
    this.collapsedList.emit(this.CollapsedListValue);
  }
  startOpen(key) {
    return !this.CollapsedListValue.includes(key);
  }
  topScroll() {
    return Math.max(0, Math.max(0, this.scrollPos - 10) * 48);
  }
  bottomScroll() {
    return Math.max(0, this.itemlength - this.scrollPos - 40) * 48;
  }
}
